// import Link from "next/link";
// import {
//   ArrowRight,
//   BarChart3,
//   Boxes,
//   Package,
//   ShieldCheck,
//   ShoppingCart,
//   Users,
// } from "lucide-react";

// export default function Home() {
//   const features = [
//     {
//       title: "Product Management",
//       description: "Manage products, categories, brands, and suppliers.",
//       icon: Package,
//     },
//     {
//       title: "Purchase Management",
//       description: "Track purchases and manage approval workflows.",
//       icon: ShoppingCart,
//     },
//     {
//       title: "Inventory Control",
//       description: "Monitor stock across branches and locations.",
//       icon: Boxes,
//     },
//     {
//       title: "Reports & Analytics",
//       description: "Get insights and track your business performance.",
//       icon: BarChart3,
//     },
//     {
//       title: "User Management",
//       description: "Manage users, roles, and branch-based access.",
//       icon: Users,
//     },
//     {
//       title: "Secure Access",
//       description: "Login securely to access your authorized features.",
//       icon: ShieldCheck,
//     },
//   ];

//   return (
//     <main className="min-h-screen bg-slate-50">
//       {/* Header */}
//       <header className="border-b border-slate-200 bg-white">
//         <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
//           <Link href="/" className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
//               TB
//             </div>

//             <div>
//               <h2 className="text-lg font-bold text-slate-900">Tech-Basket</h2>
//               <p className="text-xs text-slate-500">
//                 Inventory Management System
//               </p>
//             </div>
//           </Link>

//           <Link
//             href="/login"
//             className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
//           >
//             Login
//           </Link>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="mx-auto flex min-h-[500px] max-w-7xl items-center px-6 py-16">
//         <div className="mx-auto max-w-3xl text-center">
//           <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
//             <ShieldCheck size={18} />
//             Secure Inventory Management
//           </div>

//           <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
//             Welcome to
//             <span className="block text-blue-600">Tech-Basket</span>
//           </h1>

//           <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
//             Manage your products, purchases, inventory, branches, users, and
//             business operations from one powerful platform.
//           </p>

//           {/* Login Notice */}
//           <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-5">
//             <div className="flex items-start gap-3 text-left">
//               <ShieldCheck className="mt-0.5 text-amber-600" size={22} />

//               <div>
//                 <h3 className="font-semibold text-amber-900">Login Required</h3>

//                 <p className="mt-1 text-sm leading-6 text-amber-800">
//                   Please log in to your account to access all Tech-Basket
//                   features and manage your authorized branch data.
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
//             <Link
//               href="/login"
//               className="flex h-12 items-center gap-2 rounded-xl bg-blue-600 px-7 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 hover:shadow-xl"
//             >
//               Go to Login
//               <ArrowRight size={18} />
//             </Link>

//             <p className="text-sm text-slate-500">
//               Login to explore all available features
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="border-t border-slate-200 bg-white px-6 py-16">
//         <div className="mx-auto max-w-7xl">
//           <div className="mx-auto mb-10 max-w-2xl text-center">
//             <h2 className="text-3xl font-bold text-slate-900">
//               Everything You Need to Manage Your Business
//             </h2>

//             <p className="mt-3 text-slate-600">
//               Log in to access these powerful Tech-Basket features.
//             </p>
//           </div>

//           <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//             {features.map((feature) => {
//               const Icon = feature.icon;

//               return (
//                 <div
//                   key={feature.title}
//                   className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
//                 >
//                   <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
//                     <Icon size={24} />
//                   </div>

//                   <h3 className="text-lg font-semibold text-slate-900">
//                     {feature.title}
//                   </h3>

//                   <p className="mt-2 text-sm leading-6 text-slate-600">
//                     {feature.description}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="px-6 py-16">
//         <div className="mx-auto max-w-5xl rounded-3xl bg-slate-900 px-6 py-12 text-center sm:px-12">
//           <h2 className="text-3xl font-bold text-white">
//             Ready to Access Tech-Basket?
//           </h2>

//           <p className="mx-auto mt-4 max-w-xl text-slate-300">
//             Please sign in with your authorized account to continue to your
//             dashboard.
//           </p>

//           <Link
//             href="/login"
//             className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 transition hover:scale-105"
//           >
//             Login to Your Account
//             <ArrowRight size={18} />
//           </Link>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
//         © {new Date().getFullYear()} Tech-Basket. Inventory & RMA Management
//         System.
//       </footer>
//     </main>
//   );
// }
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Package,
  ShieldCheck,
  ShoppingCart,
  Users,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isLoggedIn = !!session?.user;

  const features = [
    {
      title: "Product Management",
      description: "Manage products, categories, brands, and suppliers.",
      icon: Package,
    },
    {
      title: "Purchase Management",
      description: "Track purchases and manage approval workflows.",
      icon: ShoppingCart,
    },
    {
      title: "Inventory Control",
      description: "Monitor stock across branches and locations.",
      icon: Boxes,
    },
    {
      title: "Reports & Analytics",
      description: "Get insights and track your business performance.",
      icon: BarChart3,
    },
    {
      title: "User Management",
      description: "Manage users, roles, and branch-based access.",
      icon: Users,
    },
    {
      title: "Secure Access",
      description: "Login securely to access your authorized features.",
      icon: ShieldCheck,
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
              TB
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">Tech-Basket</h2>

              <p className="text-xs text-slate-500">
                Inventory Management System
              </p>
            </div>
          </Link>

          {/* Dynamic Header Button */}
          <Link
            href={isLoggedIn ? "/dashboard" : "/login"}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {isLoggedIn ? "Go to Dashboard" : "Login"}
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto flex min-h-[500px] max-w-7xl items-center px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          {/* Status Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            <ShieldCheck size={18} />

            {isLoggedIn
              ? "Authenticated & Ready"
              : "Secure Inventory Management"}
          </div>

          {/* Dynamic Heading */}
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
            {isLoggedIn ? (
              <>
                Welcome back,
                <span className="block text-blue-600">
                  {session?.user?.name}
                </span>
              </>
            ) : (
              <>
                Welcome to
                <span className="block text-blue-600">Tech-Basket</span>
              </>
            )}
          </h1>

          {/* Dynamic Description */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            {isLoggedIn
              ? "Your account is successfully authenticated. You can now access your authorized Tech-Basket features and manage your branch operations."
              : "Manage your products, purchases, inventory, branches, users, and business operations from one powerful platform."}
          </p>

          {/* Dynamic Login Status */}
          {isLoggedIn ? (
            <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-start gap-3 text-left">
                <ShieldCheck
                  className="mt-0.5 shrink-0 text-green-600"
                  size={22}
                />

                <div>
                  <h3 className="font-semibold text-green-900">
                    You are successfully logged in
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-green-800">
                    Welcome back, {session?.user?.name}. Your authorized
                    features are ready to use.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <div className="flex items-start gap-3 text-left">
                <ShieldCheck
                  className="mt-0.5 shrink-0 text-amber-600"
                  size={22}
                />

                <div>
                  <h3 className="font-semibold text-amber-900">
                    Login Required
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-amber-800">
                    Please log in to your account to access all Tech-Basket
                    features and manage your authorized branch data.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Action */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="flex h-12 items-center gap-2 rounded-xl bg-blue-600 px-7 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 hover:shadow-xl"
            >
              {isLoggedIn ? "Go to Dashboard" : "Go to Login"}

              <ArrowRight size={18} />
            </Link>

            <p className="text-sm text-slate-500">
              {isLoggedIn
                ? "Your authorized features are ready"
                : "Login to explore all available features"}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-slate-200 bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Everything You Need to Manage Your Business
            </h2>

            <p className="mt-3 text-slate-600">
              {isLoggedIn
                ? "Your authorized Tech-Basket tools are ready to access."
                : "Log in to access these powerful Tech-Basket features."}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl rounded-3xl bg-slate-900 px-6 py-12 text-center sm:px-12">
          <h2 className="text-3xl font-bold text-white">
            {isLoggedIn
              ? `Welcome back, ${session?.user?.name}!`
              : "Ready to Access Tech-Basket?"}
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-slate-300">
            {isLoggedIn
              ? "Continue to your dashboard and manage your authorized Tech-Basket operations."
              : "Please sign in with your authorized account to continue to your dashboard."}
          </p>

          <Link
            href={isLoggedIn ? "/dashboard" : "/login"}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 transition hover:scale-105"
          >
            {isLoggedIn ? "Go to Dashboard" : "Login to Your Account"}

            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Tech-Basket. Inventory & RMA Management
        System.
      </footer>
    </main>
  );
}
