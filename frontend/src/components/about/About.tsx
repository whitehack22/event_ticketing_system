import carRental from '../../assets/images/about-img.jpeg';
const About = () => {
    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between gap-8 h-fit p-4 md:p-8">
                <div className="w-full md:w-1/2 flex items-center">
                    <img
                        src={carRental}
                        alt="car_rental"
                        className="w-full h-48 md:h-full object-cover rounded-lg shadow-lg"
                    />
                </div>


                <div className="w-full md:w-1/2  rounded-lg p-6 md:p-8 mb-6 md:mb-0">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-600">
                        About EventFlow
                    </h1>
                    <p className="mb-4 text-gray-700 text-base md:text-lg">
                    <span className="font-semibold">EventFlow</span> is your all-in-one event management and ticketing platform that simplifies how you discover, book, and attend events across Kenya — from concerts and conferences to cultural festivals.
                    </p>

                    <p className="mb-2 text-gray-700 text-base md:text-lg">
                    With <span className="font-semibold">EventFlow</span>, you can explore a wide range of upcoming events, get detailed event info, and reserve your spot in just a few clicks — all in real-time.
                    </p>

                    <p className="text-gray-700 text-base md:text-lg">
                    Our platform features secure, fast, and flexible payment options, ensuring every transaction is safe and hassle-free. Whether you're organizing or attending, <span className="font-semibold">EventFlow</span> makes the process smooth and reliable.
                    </p>
                </div>
            </div>

        </div>
    )
}

export default About