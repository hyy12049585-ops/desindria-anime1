import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { UserDataProvider } from "./contexts/UserDataContext";
import { GlobalMusicProvider } from "./contexts/GlobalMusicContext";
import {GlobalMusicPlayer} from "./features/music/user/components/GlobalMusicPlayer";
import { Shell } from "./components/layout/Shell/Shell";
import AccentApplier from "./components/AccentApplier";
import AdminRoute from "./components/admin/AdminRoute";
//import DebugTheme from "./components/DebugTheme";

// ========== Lazy Pages ==========

// Animation (src/pages/)
const AnimationListPage = lazy(() => import("./pages/AnimationListPage"));
const AnimationDetailsPage = lazy(() => import("./pages/AnimationDetailsPage"));

// Auth (src/pages/Auth/)
const LoginPage = lazy(() => import("./pages/Auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/Auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/Auth/ForgotPasswordPage"));
const OTPPage = lazy(() => import("./pages/Auth/OTPPage"));
const ResetPasswordPage = lazy(() => import("./pages/Auth/ResetPasswordPage"));
const TermsPage = lazy(() => import("./pages/Auth/TermsPage"));

// Main (src/pages/)
const HomePage = lazy(() => import("./pages/HomePage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const ActivityFeed = lazy(() => import("./pages/ActivityFeed"));
const WatchPage = lazy(() => import("./pages/WatchPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

// Anime (src/pages/)
const AnimeListPage = lazy(() => import("./pages/AnimeListPage"));
const AnimeDetailsPage = lazy(() => import("./pages/AnimeDetailsPage"));
const AnimeCategoryPage = lazy(() => import("./pages/AnimeCategoryPage"));

const CharacterListPage = lazy(() => import("./pages/CharacterListPage"));
const CharacterProfilePage = lazy(() => import("./pages/CharacterProfilePage"));

// Download (src/pages/)
const DownloadPage = lazy(() => import("./pages/DownloadPage"));
const DownloadRedirect = lazy(() => import("./pages/DownloadRedirect"));
const ReelsPlayerPage = lazy(() => import("./pages/ReelsPlayerPage"));

// Cinderino (src/pages/Cinderino/)
const CinderinoPage = lazy(() => import("./pages/Cinderino/CinderinoPage"));
const CinderinoProfilePage = lazy(() => import("./pages/Cinderino/CinderinoProfilePage"));
const CinderinoChallengesPage = lazy(() => import("./pages/Cinderino/CinderinoChallengesPage"));

// News (src/features/news/pages/)
const NewsPage = lazy(() => import("./features/news/pages/NewsPage"));
const NewsDetailPage = lazy(() => import("./features/news/pages/NewsDetailPage"));

// Music (src/features/music/user/pages/)
const MusicPage = lazy(() => import("./features/music/user/pages/MusicPage"));
const UserMusicPage = lazy(() => import("./features/music/user/pages/UserMusicPage"));
const MusicDetailPage = lazy(() => import("./features/music/user/pages/MusicDetailPage"));
const PlaylistDetailPage = lazy(() => import("./features/music/user/pages/PlaylistDetailPage"));

// Admin (src/pages/Admin/)
const AdminLayout = lazy(() => import("./pages/Admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const AdminAnimes = lazy(() => import("./pages/Admin/AdminAnimes"));
const AdminNews = lazy(() => import("./pages/Admin/AdminNews"));
const AdminMusic = lazy(() => import("./pages/Admin/AdminMusic"));
const AdminDownloads = lazy(() => import("./pages/Admin/AdminDownloads"));
const AdminAnimations = lazy(() => import("./pages/Admin/AdminAnimations"));
const AdminCharacters = lazy(() => import("./pages/Admin/AdminCharacters"));
const AdminReels = lazy(() => import("./pages/Admin/AdminReels"));

// ========== Layout Wrapper ==========
function WithShell({ children }: { children: React.ReactNode }) {
  return <Shell>{children}</Shell>;
}

// ========== App ==========
export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          {/* رنگ accent کاربر را سراسری روی --accent اعمال می‌کند (UI ندارد) */}
          <AccentApplier />
          <UserDataProvider>
            <GlobalMusicProvider>
 

              <Suspense
                fallback={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-lg">در حال بارگذاری...</div>
                  </div>
                }
              >
                <AppRoutes />
              </Suspense>
              {/* پلیر گلوبال موزیک - همیشه پایین صفحه نمایش داده میشه */}
              <GlobalMusicPlayer />
            </GlobalMusicProvider>
          </UserDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

// ========== Routes ==========
function AppRoutes() {
  return (
    <Routes>
      {/* ===== Auth (بدون Shell) ===== */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/otp" element={<OTPPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/terms" element={<TermsPage />} />

      {/* ===== Home ===== */}
      <Route
        path="/"
        element={
          <WithShell>
            <HomePage />
          </WithShell>
        }
      />

      {/* ===== Search ===== */}
      <Route
        path="/search"
        element={
          <WithShell>
            <SearchPage />
          </WithShell>
        }
      />

      {/* ===== Category ===== */}
      <Route
        path="/category/:slug"
        element={
          <WithShell>
            <CategoryPage />
          </WithShell>
        }
      />

      {/* ===== Activity Feed ===== */}
      <Route
        path="/activity"
        element={
          <WithShell>
            <ActivityFeed />
          </WithShell>
        }
      />

      {/* ===== Watch ===== */}
      <Route
        path="/watch/:id"
        element={
          <WithShell>
            <WatchPage />
          </WithShell>
        }
      />

      {/* ===== Anime ===== */}
      <Route
        path="/anime"
        element={
          <WithShell>
            <AnimeListPage />
          </WithShell>
        }
      />
      <Route
        path="/anime/category/:slug"
        element={
          <WithShell>
            <AnimeCategoryPage />
          </WithShell>
        }
      />
      <Route
        path="/anime/:id"
        element={
          <WithShell>
            <AnimeDetailsPage />
          </WithShell>
        }
      />
{/* ===== Characters ===== */}
      <Route
        path="/characters"
        element={
          <WithShell>
            <CharacterListPage />
          </WithShell>
        }
      />
      <Route
        path="/character/:id"
        element={
          <WithShell>
            <CharacterProfilePage />
          </WithShell>
        }
      />
{/* ===== Animation ===== */}
      <Route
        path="/animation"
        element={
          <WithShell>
            <AnimationListPage />
          </WithShell>
        }
      />
      <Route
        path="/animation/:id"
        element={
          <WithShell>
            <AnimationDetailsPage />
          </WithShell>
        }
      />
      {/* ===== Cinderino ===== */}
      <Route
        path="/cinderino"
        element={
          <WithShell>
            <CinderinoPage />
          </WithShell>
        }
      />
      <Route
        path="/cinderino/profile"
        element={
          <WithShell>
            <CinderinoProfilePage />
          </WithShell>
        }
      />
      <Route
        path="/cinderino/challenges"
        element={
          <WithShell>
            <CinderinoChallengesPage />
          </WithShell>
        }
      />

      {/* ===== News ===== */}
      <Route
        path="/news"
        element={
          <WithShell>
            <NewsPage />
          </WithShell>
        }
      />
      <Route
        path="/news/:id"
        element={
          <WithShell>
            <NewsDetailPage />
          </WithShell>
        }
      />

      {/* ===== Music ===== */}
      <Route
        path="/music"
        element={
          <WithShell>
            <MusicPage />
          </WithShell>
        }
      />
      <Route
        path="/music/me"
        element={
          <WithShell>
            <UserMusicPage />
          </WithShell>
        }
      />
      <Route
        path="/music/:id"
        element={
          <WithShell>
            <MusicDetailPage />
          </WithShell>
        }
      />
      <Route
        path="/music/playlist/:id"
        element={
          <WithShell>
            <PlaylistDetailPage />
          </WithShell>
        }
      />

      {/* ===== Profile ===== */}
      <Route
        path="/profile"
        element={
          <WithShell>
            <ProfilePage />
          </WithShell>
        }
      />

      {/* ===== Download (دانلود) ===== */}
      <Route
        path="/download/:type/:id/:season/:quality"
        element={
          <WithShell>
            <DownloadPage />
          </WithShell>
        }
      />
      <Route path="/dl/:id" element={<DownloadRedirect />} />
      <Route path="/reels" element={<ReelsPlayerPage />} />
      <Route path="/reels/:id" element={<ReelsPlayerPage />} />

      {/* ===== Admin (پنل مدیریت — فقط ادمین) ===== */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="animes" element={<AdminAnimes />} />
        <Route path="news" element={<AdminNews />} />
        <Route path="music" element={<AdminMusic />} />
        <Route path="downloads" element={<AdminDownloads />} />
        <Route path="animations" element={<AdminAnimations />} />
        <Route path="characters" element={<AdminCharacters />} />
        <Route path="reels" element={<AdminReels />} />
      </Route>

      {/* ===== 404 ===== */}
      <Route path="*" element={<Navigate to="/" replace />} />
      
    </Routes>
    
  );
}
