import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import SiteLayout from './components/layout/SiteLayout';
import HomePage from './pages/HomePage';
import HowItWorksPage from './pages/HowItWorksPage';
import PackagesPage from './pages/PackagesPage';
import DesignersPage from './pages/DesignersPage';
import DesignerDetailPage from './pages/DesignerDetailPage';
import FaqPage from './pages/FaqPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProjectWorkspacePage from './pages/projects/ProjectWorkspacePage';
import OnboardingQuizPage from './pages/onboarding/OnboardingQuizPage';
import ProjectBriefReviewPage from './pages/onboarding/ProjectBriefReviewPage';
import ShopLandingPage from './pages/products/ShopLandingPage';
import ProductCategoriesPage from './pages/products/ProductCategoriesPage';
import ProductCategoryDetailPage from './pages/products/ProductCategoryDetailPage';
import ProductBrandsPage from './pages/products/ProductBrandsPage';
import ProductBrandDetailPage from './pages/products/ProductBrandDetailPage';
import RoomCategoryPage from './pages/products/RoomCategoryPage';
import RoomVisualizerPage from './pages/RoomVisualizerPage';
import CartPage from './pages/cart/CartPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import NotFoundPage from './pages/NotFoundPage';
import RequireAuth from './routes/RequireAuth';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient();

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

const productCategoryDetailRoute = createRoute({
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

const roomCategoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/room-category',
  component: RoomCategoryPage,
});

const roomVisualizerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/room-visualizer',
  component: RoomVisualizerPage,
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

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faq',
  component: FaqPage,
});

const onboardingQuizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding/quiz',
  component: OnboardingQuizPage,
});

const briefReviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding/review',
  component: ProjectBriefReviewPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/dashboard',
  component: () => (
    <RequireAuth>
      <DashboardPage />
    </RequireAuth>
  ),
});

const projectWorkspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app/projects/$projectId',
  component: () => (
    <RequireAuth>
      <ProjectWorkspacePage />
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
  shopRoute,
  productsRoute,
  productCategoryDetailRoute,
  productBrandsRoute,
  productBrandDetailRoute,
  roomCategoryRoute,
  roomVisualizerRoute,
  cartRoute,
  checkoutRoute,
  faqRoute,
  onboardingQuizRoute,
  briefReviewRoute,
  dashboardRoute,
  projectWorkspaceRoute,
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
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
