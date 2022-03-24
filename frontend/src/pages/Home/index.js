import React from 'react';
import Carousel from '../../components/Carousel';
import Button from '../../components/Button';
import './Home.css';

const carouselCards = [
    {
        name: 'Gaming', src: '../../images/sony-2619483_1920.jpg',
        title: 'All the latest games, new and used.',
        text: 'Never miss out on the best deals for the latest games.',
        href: '/',
        style: {
            backgroundColor: 'rgba(35, 35, 35, .7)', color: '#f1f1f1',
            padding: '20px', textAlign: 'center', transform: 'translateX(-50%)',
            left: '50%', top: '64px'
        }
    },
    {
        name: 'Tech', src: '../../images/apple-1868496_1920.jpg',
        title: 'Get the latest tech at a variety of prices.',
        text: 'Want to stay up to date with the latest tech trends? We have everything you need here.',
        href: '/',
        buttonStyle: {backgroundColor: '#1f1f1f'},
        style: {
            backgroundColor: 'rgba(35, 35, 35, .8)', color: 'white',
            padding: '20px', textAlign: 'center', transform: 'translateX(-50%)',
            left: '50%', top: 'unset', bottom: '0', maxWidth: '100%'
        }
    },
    {
        name: 'Home Design', src: '../../images/furniture-998265_1920.jpg',
        title: 'Style your home the way you like with all the most popular designs.',
        buttonStyle: {backgroundColor: '#1f1f1f'},
        href: '/',
        style: {
            backgroundColor: 'rgba(35, 35, 35, .8)', color: 'white',
            padding: '20px', textAlign: 'right', transform: 'translateY(-50%)',
            left: 'unset', top: '50%', right: '0', maxWidth: '480px'
        }
    },
    {
        name: 'Sales', src: '../../images/mountain-6538890_1920.jpg',
        title: "Sales year round, you'll never miss out on a chance for a good deal.",
        href: '/',
        style: {
            backgroundColor: '#463b73', color: '#f1f1f1',
            padding: '48px', textAlign: 'center', transform: 'translate(-50%, -50%)',
            left: '50%', top: '50%', height: '360px', width: '360px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
            borderRadius: '50%'
        },
        buttonStyle: {backgroundColor: '#463b73'},
    },
    {
        name: 'Fashion', src: '../../images/man-1283231_1920.jpg',
        title: 'Stay up to date with our latest fashion pieces.',
        text: ' All the most up to date fashion trends from outrageous to smart. We have pieces however you identify!',
        buttonStyle: {backgroundColor: '#1f1f1f'},
        href: '/',
        style: {
            backgroundColor: 'rgba(35, 35, 35, .8)', color: 'white',
            padding: '20px', textAlign: 'left', transform: 'translateY(-50%)',
            left: '0', top: '50%', maxWidth: '480px'
        }
    }
]

const Home = props => {

    const cards = carouselCards;

    return (
        <div className='home'>
            <Carousel timed={true}>
                {
                    cards.map(card => {
                        const name = card.name.split(' ').join('_').toLowerCase();
                        return (
                            <div key={name}>
                                {card.src ? <img src={card.src} alt={card.name}/> : undefined}
                                <div className='text' style={card.style}>
                                    {card.title ? <h2>{card.title}</h2> : undefined}
                                    {card.text ? <p>{card.text}</p> : undefined}
                                    {card.href ? <Button style={{marginTop: '16px', ...card.buttonStyle}} href={card.href} shape='curved'>See More</Button> : undefined}
                                </div>
                            </div>
                        )
                    })
                }
            </Carousel>
        </div>
    );
};

export default Home;