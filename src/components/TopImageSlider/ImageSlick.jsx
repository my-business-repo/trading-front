import { Box } from "@mui/material";
import Slider from "react-slick";
import slide1 from "../../images/slider/slide1.jpg"
import slide2 from "../../images/slider/slide2.jpg"
import slide3 from "../../images/slider/slide3.jpg"

// const images = [
//     "https://res.cloudinary.com/demo/image/upload/v1652345767/docs/demo_image2.jpg",
//     "https://res.cloudinary.com/demo/image/upload/v1652366604/docs/demo_image5.jpg",
//     "https://res.cloudinary.com/demo/image/upload/v1652345874/docs/demo_image1.jpg",
//   ];

const images = [
    slide1, slide2, slide3
]

export default function ImageSlick() {

    const settings = {
        className: "center",
        centerMode: true,
        infinite: true,
        slidesToShow: 3,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows:false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <Box sx={{ background: 'white', borderRadius: "5px" }}>
            <Slider {...settings}>
                {images.map((URL, index) => (
                    <div className="box">
                        <img alt="sample_file" width={'100%'} src={URL} key={index} />
                    </div>
                ))}
            </Slider>
        </Box>
    )
}