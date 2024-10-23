import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Styled-components for RestaurantCard
const Card = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  margin: 10px;
  &:hover {
    transform: translateY(-5px);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const Info = styled.div`
  padding: 16px;
`;

const Rating = styled.h2`
  color: #ff6b6b;
  font-size: 24px;
  margin: 0;
`;

const Name = styled.h3`
  margin: 8px 0;
  font-size: 20px;
  color: #333;
`;

const Location = styled.p`
  margin: 4px 0;
  color: #555;
`;

const PopularMenus = styled.p`
  margin: 4px 0;
  color: #555;
`;

const Stats = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: #888;
`;

const SliderContainer = styled.div`
  background: linear-gradient(#f0f0c3, #e7e78b);
  width: 100%; 
  padding: 40px 0;
  margin: 0; 
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
  font-family: "GowunDodum-Regular";
`;

// RestaurantCard Component
const RestaurantCard = ({ restaurants_id, name, rating, location, popularMenus, imageUrl, views, likes, comments }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/restaurants/${restaurants_id}`); // 식당 ID를 경로에 포함하여 이동
  };

  return (
    <Card onClick={handleCardClick}>
      <Image src={imageUrl} alt={name} />
      <Info>
        <Rating>{rating}</Rating>
        <Name>{name}</Name>
        <Location>{location}</Location>
        <PopularMenus>인기 메뉴: {popularMenus.length ? popularMenus.join(', ') : '메뉴 정보 없음'}</PopularMenus>
        <Stats>
          <span>👁️ {views}</span>
          <span>❤️ {likes}</span>
          <span>💬 {comments}</span>
        </Stats>
      </Info>
    </Card>
  );
};

// Main App Component with Slider
const App = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect to fetch data from the API
  useEffect(() => {
    fetch('https://maketerbackend.fly.dev/api/v1/restaurants')
      .then((response) => response.json())
      .then((data) => {
        // API에서 데이터가 올바르게 오는지 확인하고 상태로 저장
        if (data && Array.isArray(data.data)) {
          setRestaurants(data.data);
        } else {
          setError('데이터를 불러오는데 실패했습니다.');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('API 호출 중 에러가 발생했습니다.');
        setLoading(false);
      });
  }, []);

  // Settings for react-slick slider with autoplay
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Shows 3 slides at a time
    slidesToScroll: 1, // Scrolls 1 slide at a time
    arrows: true, // Enables navigation arrows
    autoplay: true, // Enables automatic sliding
    autoplaySpeed: 3000, // Time in milliseconds for each slide
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <SliderContainer>
       <Title>인기 맛집들</Title>
      <Slider {...settings}>
        {restaurants.map((restaurant, index) => (
          <RestaurantCard
            key={index}
            restaurants_id={restaurant.restaurants_id} // 식당 ID 전달
            name={restaurant.restaurants_name} // API에서 받아온 데이터 사용
            rating={restaurant.rating}
            location={restaurant.address}
            popularMenus={restaurant.menus || []} // 메뉴 정보가 있을 경우 사용
            imageUrl={restaurant.image} // 이미지 없을 경우 기본 이미지 사용
            views={restaurant.views || 0} // API 데이터에 따라 조정
            likes={restaurant.likes || 0}
            comments={restaurant.comments || 0}
          />
        ))}
      </Slider>
    </SliderContainer>
  );
};

export default App;
