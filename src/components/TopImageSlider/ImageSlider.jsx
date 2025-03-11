import { Carousel } from "react-responsive-carousel";
import slide1 from "../../images/slider/slide1.jpg"
import slide2 from "../../images/slider/slide2.jpg"
import slide3 from "../../images/slider/slide3.jpg"

// const images = [
//     "https://res.cloudinary.com/demo/image/upload/v1652345767/docs/demo_image2.jpg",
//     "https://res.cloudinary.com/demo/image/upload/v1652366604/docs/demo_image5.jpg",
//     "https://res.cloudinary.com/demo/image/upload/v1652345874/docs/demo_image1.jpg",
//   ];

const images = [
    slide1,slide2,slide3
]

  export default function ImageSlider() {
    return (
      <div className="box">
        <Carousel useKeyboardArrows={true} showThumbs={false} showArrows={false} autoPlay infiniteLoop>
          {images.map((URL, index) => (
            <div className="slide">
              <img alt="sample_file" src={URL} key={index} />
            </div>
          ))}
        </Carousel>
      </div>
    );
  }