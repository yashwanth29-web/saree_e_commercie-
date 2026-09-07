import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";
import CartDrawer from "@/components/cart/CartDrawer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DL Handlooms | Pure Mangalagiri Handlooms, Direct from Master Weavers",
  description: "Authentic Mangalagiri Pattu Sarees, Pure Cotton Sarees & Dress Materials direct from Dhana Lakshmi Handlooms, Bhadravathi Nagar, Mangalagiri.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function isChromeDevToolsVitalsError(msg, err) {
                  var str = (msg ? String(msg) : "") + " " +
                            (err && err.message ? String(err.message) : "") + " " +
                            (err && err.stack ? String(err.stack) : "");
                  return str.indexOf("startTime") !== -1 ||
                         str.indexOf("reportAllChanges") !== -1 ||
                         str.indexOf("devToolsReportSoftNavs") !== -1;
                }

                // 1. window.onerror: Returning true suppresses the browser console from logging uncaught exceptions
                var origOnError = window.onerror;
                window.onerror = function(msg, url, line, col, err) {
                  if (isChromeDevToolsVitalsError(msg, err)) {
                    return true;
                  }
                  if (typeof origOnError === 'function') {
                    return origOnError.apply(this, arguments);
                  }
                  return false;
                };

                // 2. window.addEventListener('error'): Stop immediate propagation in capture phase
                window.addEventListener('error', function(e) {
                  if (isChromeDevToolsVitalsError(e.message, e.error)) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    return true;
                  }
                }, true);

                // 3. window.addEventListener('unhandledrejection'): Intercept unhandled promise rejections
                window.addEventListener('unhandledrejection', function(e) {
                  var reason = e.reason;
                  if (isChromeDevToolsVitalsError(reason && reason.message, reason)) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    return true;
                  }
                }, true);

                // 4. Override console.error: Suppress direct logging of this Chromium regression
                var origConsoleError = console.error;
                console.error = function() {
                  var args = Array.prototype.slice.call(arguments);
                  var text = args.map(function(arg) {
                    if (!arg) return "";
                    if (arg instanceof Error) return (arg.message || "") + " " + (arg.stack || "");
                    return String(arg);
                  }).join(" ");
                  if (isChromeDevToolsVitalsError(text)) {
                    return;
                  }
                  origConsoleError.apply(console, arguments);
                };

                // 5. Intercept devToolsReportSoftNavs if injected by Chrome DevTools Live Metrics
                try {
                  var _devToolsReportSoftNavs;
                  Object.defineProperty(window, 'devToolsReportSoftNavs', {
                    configurable: true,
                    enumerable: true,
                    get: function() { return _devToolsReportSoftNavs; },
                    set: function(fn) {
                      if (typeof fn === 'function') {
                        _devToolsReportSoftNavs = function() {
                          try {
                            return fn.apply(this, arguments);
                          } catch (err) {}
                        };
                      } else {
                        _devToolsReportSoftNavs = fn;
                      }
                    }
                  });
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAFAF8] text-[#1C2621]">
        {children}
        <CartDrawer />
        <BottomNav />
      </body>
    </html>
  );
}
