import { addDoc, collection, doc, getDoc, getDocs, updateDoc, limit, query, startAfter, where, getCountFromServer, serverTimestamp, orderBy } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storageRef } from "./config/FirebaseConfig";
import algoliasearch from 'algoliasearch/lite';
import { convertTimeStampToDateAdvertCard, convertTimeStampToDateAdvertCardWithYear } from "./UtilsService";
const algoliaClient = algoliasearch(process.env.REACT_APP_ALGOLIA_APP_ID, process.env.REACT_APP_ALGOLIA_SEARCH_KEY);
const indexAdverts = algoliaClient.initIndex('adverts');
const indexPriceAsc = algoliaClient.initIndex('price_asc');
const indexPriceDesc = algoliaClient.initIndex('price_desc');

export const createAdvert = async (advert, type) => {
    //Create advert doc with advert data and random id
    try {
        await addDoc(collection(db, "adverts"), {
            title: advert?.title || "",
            description: advert?.description || "",
            printer_model: advert?.printer_model || "",
            colors: advert?.colors || "",
            size: advert?.size || "",
            price: parseInt(advert?.price) || 0,
            images: [],
            city: advert?.city || "",
            district: advert?.district || "",
            model_obj: "",
            type: type || "",
            user_id: auth.currentUser.uid,
            is_premium: advert?.is_premium || false,
            created_at: serverTimestamp(),
            is_active: true,
        }).then(async (docRef) => {
            //Get id of created advert
            let advertId = docRef.id;
            let folderRef = ref(storageRef, `adverts/${auth.currentUser.uid}/${advertId}/`);
            let image_urls = [];
            let model_url = "";
            //If there are images in advert, upload them to storage
            let folderRefImages = ref(folderRef, "images");
            for (let i = 0; i < advert?.images.length; i++) {
                let imageRef = ref(folderRefImages, advert.images[i].name);
                //Upload these image in the folder
                await uploadBytes(imageRef, advert.images[i].originFileObj).then(async (snapshot) => {
                    //Get download url of uploaded image
                    await getDownloadURL(snapshot.ref).then((url) => {
                        //Add this url to array of image urls
                        image_urls.push({
                            url: url,
                            name: advert.images[i].name,
                        });
                    });
                });
            }
            if (advert?.model_obj) {
                const modelRef = ref(storageRef, `adverts/${auth.currentUser.uid}/${advertId}/model_obj/${advert.model_obj[0].name}`);
                await uploadBytes(modelRef, advert.model_obj[0].originFileObj).then(async (snapshot) => {
                    //Get download url of uploaded image
                    await getDownloadURL(snapshot.ref).then((url) => {
                        //Add this url to array of image urls
                        model_url = {
                            url: url,
                            name: advert.model_obj[0].name,
                        };
                    });
                });
            }
            //Update advert with image urls and model url
            await updateDoc(doc(db, "adverts", advertId), {
                images: image_urls,
                model_obj: model_url,
            })
        });

        //If user is not premium, make the other adverts of user is not active
        if (!advert?.is_premium) {
            const advertsRef = collection(db, "adverts");
            const q = query(advertsRef, where("user_id", "==", auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((docCopy) => {
                if (docCopy.id !== advert.id){
                    updateDoc(doc(db, "adverts", docCopy.id), {
                        is_active: false,
                    });
                }
            });
        }
        return {
            status: 200,
            message: "Advert created successfully",
        };
    } catch (error) {
        return {
            status: 500,
            message: "There is an error while creating advert",
        }
    }


};

export const getAdvert = async (advertId) => {
    let advert = null;
    let user = null;
    const advertRef = doc(db, "adverts", advertId);
    let document = await getDoc(advertRef);
    advert = document.data();

    const userRef = doc(db, "user", advert.user_id);
    document = await getDoc(userRef);
    user = document.data();

    advert.user = user;
    advert.user_name = user.name + " " + user.surname;
    advert.location = advert.district + ", " + advert.city;

    //advert colors array to string
    //İf a
    advert.colors = advert.colors.join(", ");
    advert.created_at = convertTimeStampToDateAdvertCardWithYear(advert.created_at);
    advert.id = advertId;
    //Clear advert.city and advert.district
    delete advert.city;
    delete advert.district;
    return advert;
};

//Get adverts with pagination
export const getAdverts = async (page, limitNumber, lastIndexId, data) => {
    let advertsRef = collection(db, "adverts");
    let baseQuery = query(advertsRef, where("is_active", "==", true));
    let baseQueryCopy = null;
    // Check if the location parameter is valid
    if (data?.location && data?.location !== "") {
        //Locaiton can be "city" or "district, city"
        let district = data.location.includes(",") ? data.location.split(",")[0] : "";
        let city = data.location.includes(",") ? data.location.split(", ")[1] : data.location;
        if (district !== "") {
            baseQuery = query(baseQuery, where("district", "==", district), where("city", "==", city));
        } else {
            baseQuery = query(baseQuery, where("city", "==", city));
        }
    }
    // Check if the page parameter is valid
    if (page !== 0) {
        let lastIndex = doc(advertsRef, lastIndexId);
        let lastRef = await getDoc(lastIndex);
        baseQueryCopy = baseQuery;
        baseQuery = query(baseQuery, limit(limitNumber), orderBy("created_at", "desc"), startAfter(lastRef));
    }
    else {
        baseQueryCopy = baseQuery;
        baseQuery = query(baseQuery, limit(limitNumber), orderBy("created_at", "desc"));
    }

    const snapshot = await getCountFromServer(baseQueryCopy);
    let countAll = snapshot.data().count;
    let queryFillSnapshot = null;
    //Page is 0, and there is not enough adverts to fill the page, get the adverts without concidering location
    if (snapshot.data().count < limitNumber && page === 0) {
        const queryFill = query(advertsRef, where("is_active", "==", true), limit(limitNumber - snapshot.data().count), orderBy("created_at", "desc"));
        queryFillSnapshot = await getDocs(queryFill);
        countAll = snapshot.data().count + queryFillSnapshot.size;
    }
    let adverts = [];
    //If page is 0, get 3 premium adverts and add them to the beginning of the array
    if (page === 0) {
        const premiumQuery = query(advertsRef, where("is_active", "==", true), where("is_premium", "==", true), limit(3), orderBy("created_at", "desc"));
        const premiumQuerySnapshot = await getDocs(premiumQuery);
        premiumQuerySnapshot.forEach((doc) => {
            let advertTemp = {
                title: doc.data().title,
                image: doc.data().images[0].url,
                is_premium: doc.data().is_premium,
                price: doc.data().price,
                location: doc.data().city + ", " + doc.data().district,
                date: convertTimeStampToDateAdvertCard(doc.data().created_at),
                advert_id: doc.id,
                type: doc.data().type === "service" ? "Sell Service" : doc.data().type === "model" ? "Sell Model" : "Model Request",
            };
            adverts.push(advertTemp);
        });
    }

    const querySnapshot = await getDocs(baseQuery);
    querySnapshot.forEach((doc) => {
        let advertTemp = {
            title: doc.data().title,
            image: doc.data().images[0].url,
            is_premium: doc.data().is_premium,
            price: doc.data().price,
            location: doc.data().city + ", " + doc.data().district,
            date: convertTimeStampToDateAdvertCard(doc.data().created_at),
            advert_id: doc.id,
            type: doc.data().type === "service" ? "Sell Service" : doc.data().type === "model" ? "Sell Model" : "Model Request",
        };
        adverts.push(advertTemp);
    });
    if (queryFillSnapshot) {
        queryFillSnapshot.forEach((doc) => {
            let advertTemp = {
                title: doc.data().title,
                image: doc.data().images[0].url,
                is_premium: doc.data().is_premium,
                price: doc.data().price,
                location: doc.data().city + ", " + doc.data().district,
                date: convertTimeStampToDateAdvertCard(doc.data().created_at),
                advert_id: doc.id,
                type: doc.data().type === "service" ? "Sell Service" : doc.data().type === "model" ? "Sell Model" : "Model Request",
            };
            adverts.push(advertTemp);
        });
    }





    return { adverts: adverts, count: countAll };
};

export const getOwnedAdverts = async () => {
    const user_id = auth.currentUser.uid;
    const advertsRef = collection(db, "adverts");
    const q = query(advertsRef, where("user_id", "==", user_id));

    const querySnapshot = await getDocs(q);
    let adverts = [];
    querySnapshot.forEach((doc) => {
        let advert = doc.data();
        advert.advert_id = doc.id;
        adverts.push(advert);
    });
    return adverts;
};

export const sendReport = async (advert, reportText) => {
    const reportRef = collection(db, "reports");
    await addDoc(reportRef, {
        advertID: advert.id,
        senderID: auth.currentUser.uid,
        reportText: reportText,
        reportFrom: "advert",
        createdAt: serverTimestamp(),
        isActive: true
    });
};

export const updateAdvert = async (advert, type) => {
    try {
        const advertRef = doc(db, "adverts", advert.id);
        let folderRef = ref(storageRef, `adverts/${auth.currentUser.uid}/${advert.id}`);
        let folderRefImages = ref(folderRef, "/images");
        let folderRefModelObj = ref(folderRef, "/model_obj");
        //Images in the images folder, model_obj in the model_obj folder
        //Update images and if type is buyer update model_obj in cloud storage and update datas in firestore
        let images = [];
        for (let i = 0; i < advert?.images.length; i++) {
            let imageRef = ref(folderRefImages, advert.images[i].name);
            await uploadBytes(imageRef, advert.images[i].originFileObj).then(async (snapshot) => {
                //Get download url of uploaded image
                await getDownloadURL(snapshot.ref).then((url) => {
                    //Add this url to array of image urls
                    images.push({
                        url: url,
                        name: advert.images[i].name,
                    });
                });
            });
        }
        let model_obj = null;
        if (type === "buyer") {
            if (advert.model_obj) {
                let model_objRef = ref(folderRefModelObj, advert?.model_obj.name);
                await uploadBytes(model_objRef, advert?.model_obj.originFileObj).then(async (snapshot) => {
                    //Get download url of uploaded image
                    await getDownloadURL(snapshot.ref).then((url) => {
                        //Add this url to array of image urls
                        model_obj = {
                            name: advert.model_obj.name,
                            url: url,
                        };
                    });
                });
            }
        }
        await updateDoc(advertRef, {
            title: advert?.title,
            description: advert?.description,
            price: advert?.price,
            city: advert?.city,
            district: advert?.district,
            images: images ? images : null,
            model_obj: model_obj ? model_obj : null,
        });
    } catch (error) {
        return {
            status: 400,
            message: "An error occured while updating advert, please try again later",
        };
    }
    return {
        status: 200,
        message: "Advert updated successfully",
    }
};

export const changeAdvertStatus = async (advertId, status) => {
    //If the users is not premium, the other ones adverts will be deactivated
    const advertRef = doc(db, "adverts", advertId);
    const userRef = doc(db, "user", auth.currentUser.uid);
    await updateDoc(advertRef, {
        is_active: status,
    });
    const user = await getDoc(userRef);
    if (user.data().premiumID === null) {
        const advertsRef = collection(db, "adverts");
        const q = query(advertsRef, where("user_id", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
            if (doc.id !== advertId) {
                await updateDoc(doc.ref, {
                    is_active: false,
                });
            }
        });
    }
};


export const searchAdverts = async (page, limitNumber, data) => {
    let params = {
        hitsPerPage: limitNumber,
        filters: 'is_active:true',
    };

    //Check if the location parameter is valid
    if (data?.location && data?.location !== '') {
        let district = data.location.includes(',') ? data.location.split(',')[0] : '';
        let city = data.location.includes(',') ? data.location.split(', ')[1] : data.location;

        if (district !== '') {
            params = {
                ...params,
                filters: `${params.filters || ''} AND district:${district} AND city:${city}`,
            };
        } else {
            params = {
                ...params,
                filters: `${params.filters || ''} AND city:${city}`,
            };
        }
    }

    // Check if the minPrice parameter is valid
    if (data?.minPrice && data?.minPrice !== '') {
        data.minPrice = parseInt(data.minPrice);
        params = {
            ...params,
            filters: `${params.filters || ''} AND price >= ${data.minPrice}`,
        };
    }

    // Check if the maxPrice parameter is valid
    if (data?.maxPrice && data?.maxPrice !== '') {
        data.maxPrice = parseInt(data.maxPrice);
        params = {
            ...params,
            filters: `${params.filters || ''} AND price <= ${data.maxPrice}`,
        };
    }

    // Check if the type parameter is valid
    if (data?.type && data?.type !== '' && data?.typeParam !== '' && data?.typeParam !== null) {
        params = {
            ...params,
            filters: `${params.filters || ''} AND type:${data.typeParam}`,
        };
    }

    // Check if the page parameter is valid
    if (page !== 0) {
        // let lastIndex = await indexAdverts.getObject(lastIndexId);
        params = {
            ...params,
            page: page,
        };
    }

    let searchResult = null;


    // Check if the sortText parameter is valid
    if (data?.sortText && data?.sortText !== '' && data?.sortParam !== null && data?.sortParam !== '') {
        let sortParam1 = data.sortParam.split(' ')[0]; //price
        let sortParam2 = data.sortParam.split(' ')[1]; //asc or desc

        if (sortParam1 === "price" && sortParam2 === "asc") {
            searchResult = await indexPriceAsc.search(data.value, params);
        } else if (sortParam1 === "price" && sortParam2 === "desc") {
            searchResult = await indexPriceDesc.search(data.value, params);
        } else {
            searchResult = await indexAdverts.search(data.value, params);
        }
    }
    else {
        searchResult = await indexAdverts.search(data.value, params);
    }
    const count = searchResult.nbHits;
    const hits = searchResult.hits;
    let adverts = hits.map((hit) => ({
        title: hit.title,
        image: hit.images[0].url,
        is_premium: hit.is_premium,
        price: hit.price,
        location: `${hit.city}, ${hit.district}`,
        date: convertTimeStampToDateAdvertCard(hit.created_at),
        advert_id: hit.objectID,
        type:
            hit.type === 'service' ? 'Sell Service' : hit.type === 'model' ? 'Sell Model' : 'Model Request',
    }));
    return { adverts, count };
};
