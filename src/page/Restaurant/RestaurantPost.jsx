import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { selectedRestaurantState } from "../../state/mapAtoms";

const fetchRestaurantDetails = async (restaurants_id, setRestaurant) => {
  setRestaurant((prev) => ({ ...prev, loading: true }));
  try {
    const response = await fetch(`https://maketerbackend.fly.dev/api/v1/restaurants/${restaurants_id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch restaurant details');
    }
    const data = await response.json();
    console.log(data);

    setRestaurant({ details: data, loading: false, error: null });
  } catch (error) {
    console.error("Error fetching restaurant data:", error);
    setRestaurant({ details: {}, loading: true, error: null });

  }
};

const RestaurantPost = () => {
  const { restaurants_id } = useParams();
  const [restaurant, setRestaurant] = useRecoilState(selectedRestaurantState);

  useEffect(() => {
    if (restaurants_id && (!restaurant.details || restaurant.details.restaurants_id !== restaurants_id)) {
      // Recoil 상태에 데이터가 없거나 ID가 일치하지 않을 경우에만 API 호출
      fetchRestaurantDetails(restaurants_id, setRestaurant);
    }
  }, [restaurants_id, setRestaurant, restaurant.details]);

  const { details = {}, loading, error } = restaurant;


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!details || !details.name) {
    return <div>No restaurant data available</div>;
  }

  const handleReservation = () => {
    console.log("예약하기 클릭됨");
  };

  return (
    <Container>
      <Title>{details.name}</Title>
      <DetailsSection>
        <SectionTitle>상세정보</SectionTitle>
        <DetailInfo>영업시간: {details.opening_hours || "정보 없음"}</DetailInfo>
        <DetailInfo>주소: {details.address || "정보 없음"}</DetailInfo>
        <DetailInfo>전화번호: {details.phone || "정보 없음"}</DetailInfo>
        <DetailInfo>평점: {details.rating || "정보 없음"}</DetailInfo>
        <Button onClick={handleReservation}>예약하기</Button>
      </DetailsSection>
    </Container>
  );
};

export default RestaurantPost;


// Styled components
const Container = styled.div`
  width: 100%;
  max-width: 90vw;
  margin: 0 auto;
  padding: 5vw 2vw;

  @media (max-width: 768px) {
    padding: 10vw 4vw;
  }
`;

const Title = styled.h1`
  font-size: 4vw;
  color: #2c3e50;
  margin-bottom: 4vw;
  text-align: center;
  font-family: "GowunDodum-Regular";
  text-transform: uppercase;
  letter-spacing: 0.2rem;

  @media (max-width: 768px) {
    font-size: 6vw;
  }
`;

const DetailsSection = styled.div`
  margin-top: 5vw;
  padding: 4vw;
  background-color: #ecf0f1;
  border-radius: 1.5rem;
  box-shadow: 0 0.8rem 1.6rem rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 8vw;
  }
`;

const SectionTitle = styled.h2`
  font-size: 3.5vw;
  color: #2c3e50;
  margin-bottom: 3vw;
  font-family: "GowunDodum-Regular";

  @media (max-width: 768px) {
    font-size: 5vw;
  }
`;

const DetailInfo = styled.p`
  font-size: 2vw;
  color: #7f8c8d;
  margin: 1vw 0;
  font-family: 'Open Sans', sans-serif;

  @media (max-width: 768px) {
    font-size: 4.5vw;
  }
`;

const Button = styled.button`
  background-color: #e74c3c;
  color: white;
  padding: 1vw 2vw;
  border: none;
  border-radius: 0.6rem;
  cursor: pointer;
  margin: 1vw 0.5vw;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c0392b;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 3vw;
  }
`;
