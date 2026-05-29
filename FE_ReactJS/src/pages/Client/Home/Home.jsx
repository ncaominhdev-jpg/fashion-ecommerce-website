import BannerSlider from "./Banner/banner";
import CategorySection from "./CategorySection/CategorySection";
import FeaturedProducts from "./FeaturedProducts/FeaturedProducts";
import DealsSlider from "./DealsSlider/DealsSlider";
import Trends from "./Trends/Trends";
import CustomerReviews from "./CustomerReviews/CustomerReviews";
import BlogList from "./BlogList/BlogList";
import BrandLogos from "./BrandLogos/BrandLogos";

const Home = () => {

    return (
        <>
            <BannerSlider />
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <CategorySection />

                <FeaturedProducts />

                <Trends />

                <DealsSlider />

                <CustomerReviews />

                <BlogList />

                <BrandLogos />
            </main>
        </>
    );
};

export default Home;
