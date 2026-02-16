import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SiteLayout from './components/layout/SiteLayout';
import HomePage from './pages/HomePage';
import HowItWorksPage from './pages/HowItWorksPage';
import PackagesPage from './pages/PackagesPage';
import DesignersPage from './pages/DesignersPage';
import DesignerDetailPage from './pages/DesignerDetailPage';
import FaqPage from './pages/FaqPage';
import OnboardingQuizPage from './pages/onboarding/OnboardingQuizPage';
import ProjectBriefReviewPage from './pages/onboarding/ProjectBriefReviewPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProjectWorkspacePage from './pages/projects/ProjectWorkspacePage';
import NotFoundPage from './pages/NotFoundPage';
import ProductCategoriesPage from './pages/products/ProductCategoriesPage';
import ProductCategoryDetailPage from './pages/products/ProductCategoryDetailPage';
import ProductBrandsPage from './pages/products/ProductBrandsPage';
import ProductBrandDetailPage from './pages/products/ProductBrandDetailPage';
import RoomVisualizerPage from './pages/RoomVisualizerPage';
import ShopLandingPage from './pages/products/ShopLandingPage';
import RoomCategoryPage from './pages/products/RoomCategoryPage';
import FurnitureSubCategoryPage from './pages/products/FurnitureSubCategoryPage';
import CartPage from './pages/cart/CartPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import RequireAuth from './routes/RequireAuth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const rootRoute = createRootRoute({
  component: () => (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const howItWorksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/how-it-works',
  component: HowItWorksPage,
});

const packagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/packages',
  component: PackagesPage,
});

const designersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/designers',
  component: DesignersPage,
});

const designerDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/designers/$designerId',
  component: DesignerDetailPage,
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faq',
  component: FaqPage,
});

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quiz',
  component: OnboardingQuizPage,
});

const reviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/review',
  component: ProjectBriefReviewPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <RequireAuth>
      <DashboardPage />
    </RequireAuth>
  ),
});

const projectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects/$projectId',
  component: ProjectWorkspacePage,
});

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop',
  component: ShopLandingPage,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductCategoriesPage,
});

const productCategoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/$categoryId',
  component: ProductCategoryDetailPage,
});

const productBrandsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/brands',
  component: ProductBrandsPage,
});

const productBrandDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/brands/$brandId',
  component: ProductBrandDetailPage,
});

const roomVisualizerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/visualizer',
  component: RoomVisualizerPage,
});

const roomCategoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/room-category',
  component: RoomCategoryPage,
});

const furnitureSubCategoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/furniture/$subCategory',
  component: FurnitureSubCategoryPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: () => (
    <RequireAuth>
      <CheckoutPage />
    </RequireAuth>
  ),
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: NotFoundPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  howItWorksRoute,
  packagesRoute,
  designersRoute,
  designerDetailRoute,
  faqRoute,
  quizRoute,
  reviewRoute,
  dashboardRoute,
  projectRoute,
  shopRoute,
  productsRoute,
  productCategoryRoute,
  productBrandsRoute,
  productBrandDetailRoute,
  roomVisualizerRoute,
  roomCategoryRoute,
  furnitureSubCategoryRoute,
  cartRoute,
  checkoutRoute,
  notFoundRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
