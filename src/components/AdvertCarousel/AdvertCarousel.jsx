import { Carousel } from "antd";

const AdvertCarousel = () => {

    return (
        //orange div at center 
        <div style={{ backgroundColor: 'orange', width: '100%', height: '100%' }}>
            <Carousel>
                <div>
                    <h1>1</h1>
                </div>
                <div>
                    <h1>2</h1>
                </div>
            </Carousel>
        </div>
    );
};

export default AdvertCarousel;