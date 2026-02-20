import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

import SiteHeader from './components/navigation/SiteHeader';
import SiteFooter from './components/navigation/SiteFooter';
import HomePage from './pages/HomePage';
import HowItWorksPage from './pages/HowItWorksPage';
import PackagesPage from './pages/PackagesPage';
import DesignersPage from './pages/DesignersPage';
import DesignerDetailPage from './pages/DesignerDetailPage';
import FaqPage from './pages/FaqPage';
import OnboardingQuizPage from './pages/onboarding/OnboardingQuizPage';
import ProjectBriefReviewPage from './pages/onboarding/ProjectBriefReviewPage';
import DesignerMatchingPage from './pages/onboarding/DesignerMatchingPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProjectWorkspacePage from './pages/projects/ProjectWorkspacePage';
import NotFoundPage from './pages/NotFoundPage';
import ShopLandingPage from './pages/products/ShopLandingPage';
import ProductCategoriesPage from './pages/products/ProductCategoriesPage';
import ProductCategoryDetailPage from './pages/products/ProductCategoryDetailPage';
import ProductBrandsPage from './pages/products/ProductBrandsPage';
import ProductBrandDetailPage from './pages/products/ProductBrandDetailPage';
import RoomVisualizerPage from './pages/RoomVisualizerPage';
import FurnitureMenuPage from './pages/products/FurnitureMenuPage';
import FurnitureSubCategoryPage from './pages/products/FurnitureSubCategoryPage';
import DecorLandingPage from './pages/products/DecorLandingPage';
import FurnishingLandingPage from './pages/products/FurnishingLandingPage';
import RoomCategoryPage from './pages/products/RoomCategoryPage';
import CartPage from './pages/cart/CartPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import VendorsPage from './pages/vendors/VendorsPage';
import GiftCardPage from './pages/gift/GiftCardPage';
import DesignersAndPackagesLandingPage from './pages/DesignersAndPackagesLandingPage';
import RequireAuth from './routes/RequireAuth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
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

const designersAndPackagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/designers-and-packages',
  component: DesignersAndPackagesLandingPage,
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

const matchingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/matching',
  component: DesignerMatchingPage,
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

const projectWorkspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects/$projectId',
  component: ProjectWorkspacePage,
});

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop',
  component: ShopLandingPage,
});

const productCategoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop/categories',
  component: ProductCategoriesPage,
});

const productCategoryDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop/categories/$categoryId',
  component: ProductCategoryDetailPage,
});

const productBrandsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop/brands',
  component: ProductBrandsPage,
});

const productBrandDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop/brands/$brandId',
  component: ProductBrandDetailPage,
});

const roomVisualizerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/visualizer',
  component: RoomVisualizerPage,
});

const furnitureMenuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop/furniture',
  component: FurnitureMenuPage,
});

const furnitureSubCategoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop/furniture/$subCategory',
  component: FurnitureSubCategoryPage,
});

const decorLandingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop/decor',
  component: DecorLandingPage,
});

const furnishingLandingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop/furnishing',
  component: FurnishingLandingPage,
});

const roomCategoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop/room-packages',
  component: RoomCategoryPage,
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

const vendorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vendors',
  component: () => (
    <RequireAuth>
      <VendorsPage />
    </RequireAuth>
  ),
});

const giftCardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gift',
  component: GiftCardPage,
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
  designersAndPackagesRoute,
  designerDetailRoute,
  faqRoute,
  quizRoute,
  reviewRoute,
  matchingRoute,
  dashboardRoute,
  projectWorkspaceRoute,
  shopRoute,
  productCategoriesRoute,
  productCategoryDetailRoute,
  productBrandsRoute,
  productBrandDetailRoute,
  roomVisualizerRoute,
  furnitureMenuRoute,
  furnitureSubCategoryRoute,
  decorLandingRoute,
  furnishingLandingRoute,
  roomCategoryRoute,
  cartRoute,
  checkoutRoute,
  vendorsRoute,
  giftCardRoute,
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
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
