import person1 from '../../assets/images/person1.png';
import person2 from '../../assets/images/person2.png';
import person3 from '../../assets/images/person3.png';

type Testimonial = {
    id: number;
    name: string;
    role: string;
    image: string;
    content: string;
};

export const testimonialsData: Testimonial[] = [
    {
        id: 1,
        name: 'John Mwangi',
        role: 'Master of Ceremonies',
        image: person1,
        content: 'EventFlow has really helped me book for events on time',
    },
    {
        id: 2,
        name: 'Jane Smith',
        role: 'Software Engineer',
        image: person3,
        content: 'With EventFlow I was able to find events around my area easily.',
    },
    {
        id: 3,
        name: 'Michael Kiplangat',
        role: 'Artist',
        image: person2,
        content: 'I was able to interact with other artists and have a good time.',
    },
    {
        id: 4,
        name: 'Emily Davis',
        role: 'Painter',
        image: person3,
        content: 'I was able to attend an art exhibition on interact with other painters.',
    },
    {
        id: 5,
        name: 'David Odhiambo',
        role: 'DJ',
        image: person1,
        content: 'With EventFlow I was able to get a gig that attracted a lot of people around my area',
    },
    {
        id: 6,
        name: 'Sophia Njeri',
        role: 'Singer',
        image: person3,
        content: 'EventFlow helped me set up a concert at the Heart of Nairobi and reach out to a lot of people. Highly recommend you check them out!',
    },
];