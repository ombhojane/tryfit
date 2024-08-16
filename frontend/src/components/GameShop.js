import React, { useState } from 'react';
import styled from 'styled-components';

const GameShopContainer = styled.div`
  font-family: 'Roboto', sans-serif;
  background-color: #f9f9f9;
  color: #333333;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  width: 1300px;
  max-width: 95vw;
  height: 85vh;
  display: flex;
  flex-direction: column;
`;

const ShopTitle = styled.h1`
  text-align: center;
  color: #2c3e50;
  font-size: 32px;
  margin-bottom: 25px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ShopContent = styled.div`
  display: flex;
  flex: 1;
  gap: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const Sidebar = styled.div`
  width: 220px;
  background-color: #f1f3f5;
  padding: 20px;
`;

const SectionTitle = styled.h2`
  color: #2c3e50;
  font-size: 20px;
  margin-bottom: 15px;
  font-weight: 500;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
`;

const CategoryList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const CategoryItem = styled.li`
  cursor: pointer;
  margin-bottom: 12px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: ${props => props.active ? '600' : '400'};
  background-color: ${props => props.active ? '#e0e0e0' : 'transparent'};

  &:hover {
    background-color: #e0e0e0;
  }
`;

const ProductGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;
  padding: 25px;
  overflow-y: auto;
`;

const ProductCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-5px);
  }
`;

const ProductImage = styled.div`
  width: 180px;
  height: 180px;
  background-color: #f5f5f5;
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #999999;
  border-radius: 8px;
`;

const ProductName = styled.h3`
  font-size: 18px;
  text-align: center;
  margin-bottom: 10px;
  font-weight: 500;
  color: #2c3e50;
`;

const ProductPrice = styled.p`
  font-size: 16px;
  color: #3498db;
  font-weight: 600;
`;

const ProductView = styled.div`
  flex: 1;
  background-color: #ffffff;
  padding: 30px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const ProductViewHeader = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
`;

const ProductViewImage = styled(ProductImage)`
  width: 400px;
  height: 400px;
  flex-shrink: 0;
`;

const ProductViewInfo = styled.div`
  flex: 1;
`;

const ProductViewTitle = styled.h2`
  font-size: 28px;
  margin-bottom: 15px;
  color: #2c3e50;
  font-weight: 600;
`;

const ProductViewDescription = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
  line-height: 1.6;
  color: #555555;
`;

const ProductViewDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const ProductViewPrice = styled.span`
  font-size: 24px;
  color: #3498db;
  font-weight: 600;
`;

const ProductViewUpvotes = styled.span`
  font-size: 18px;
  color: #7f8c8d;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const BuyButton = styled.a`
  background-color: #2ecc71;
  color: #ffffff;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 6px;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.3s ease;
  text-align: center;
  display: inline-block;

  &:hover {
    background-color: #27ae60;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ProductViewSection = styled.div`
  margin-top: 30px;
`;

const ProductViewSectionTitle = styled.h3`
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 15px;
  font-weight: 500;
`;

const FeaturesList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const FeatureItem = styled.li`
  font-size: 16px;
  color: #555555;
  margin-bottom: 10px;
  display: flex;
  align-items: center;

  &:before {
    content: '✓';
    color: #2ecc71;
    font-weight: bold;
    margin-right: 10px;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: #3498db;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
`;

const ProductViewContainer = styled.div`
  position: relative;
  flex: 1;
  background-color: #ffffff;
  padding: 30px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const GameShop = ({ shopData }) => {
  const [selectedCategory, setSelectedCategory] = useState('Trending');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const allProducts = Object.values(shopData.categories).flat();
  const trendingProducts = allProducts.sort((a, b) => b.upvotes - a.upvotes).slice(0, 5);

  const displayProducts = selectedCategory === 'Trending' 
    ? trendingProducts 
    : shopData.categories[selectedCategory] || [];

  const handleBackToHome = () => {
    setSelectedProduct(null);
  };

      return (
        <GameShopContainer>
          <ShopTitle>{shopData.name}</ShopTitle>
          <ShopContent>
            <Sidebar>
              <SectionTitle>Categories</SectionTitle>
              <CategoryList>
                <CategoryItem 
                  onClick={() => setSelectedCategory('Trending')}
                  active={selectedCategory === 'Trending'}
                >
                  Trending
                </CategoryItem>
                {Object.keys(shopData.categories).map((category) => (
                  <CategoryItem 
                    key={category} 
                    onClick={() => setSelectedCategory(category)}
                    active={selectedCategory === category}
                  >
                    {category}
                  </CategoryItem>
                ))}
              </CategoryList>
            </Sidebar>
            {selectedProduct ? (
              <ProductViewContainer>
                <BackButton onClick={handleBackToHome}>← Back to Products</BackButton>
                <ProductViewHeader>
                  <ProductViewImage>[Product Image]</ProductViewImage>
                  <ProductViewInfo>
                    <ProductViewTitle>{selectedProduct.name}</ProductViewTitle>
                    <ProductViewDescription>{selectedProduct.description}</ProductViewDescription>
                    <ProductViewDetails>
                      <ProductViewPrice>{selectedProduct.price}</ProductViewPrice>
                      <ProductViewUpvotes>
                        👍 {selectedProduct.upvotes} Upvotes
                      </ProductViewUpvotes>
                    </ProductViewDetails>
                    <BuyButton href={selectedProduct.buyLink} target="_blank" rel="noopener noreferrer">
                      Buy Now
                    </BuyButton>
                  </ProductViewInfo>
                </ProductViewHeader>
              
            
              </ProductViewContainer>
            ) : (
              <ProductGrid>
                {displayProducts.map((product) => (
                  <ProductCard key={product.name} onClick={() => setSelectedProduct(product)}>
                    <ProductImage>[Product Image]</ProductImage>
                    <ProductName>{product.name}</ProductName>
                    <ProductPrice>{product.price}</ProductPrice>
                  </ProductCard>
                ))}
              </ProductGrid>
            )}
          </ShopContent>
        </GameShopContainer>
      );
    };
    

export default GameShop;