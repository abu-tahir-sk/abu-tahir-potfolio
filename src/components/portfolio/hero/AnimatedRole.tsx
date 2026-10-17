// "use client";

// import React, { useState, useEffect } from "react";

// const ROLES = [
//   "Full-Stack Web Developer",
//   "Next.js Developer",
//   "TypeScript Developer",
// ];

// export function AnimatedRole() {
//   const [roleIndex, setRoleIndex] = useState(0);
//   const [displayedText, setDisplayedText] = useState(ROLES[0]);
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [isPaused, setIsPaused] = useState(true);
//   const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

//   useEffect(() => {
//     const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
//     setPrefersReducedMotion(mediaQuery.matches);

//     const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
//     mediaQuery.addEventListener("change", handler);
//     return () => mediaQuery.removeEventListener("change", handler);
//   }, []);

//   // Initial pause on the first role before starting deletion
//   useEffect(() => {
//     if (prefersReducedMotion) return;
//     const initialTimer = setTimeout(() => {
//       setIsPaused(false);
//       setIsDeleting(true);
//     }, 2400);
//     return () => clearTimeout(initialTimer);
//   }, [prefersReducedMotion]);

//   useEffect(() => {
//     if (prefersReducedMotion || isPaused) return;

//     const currentRole = ROLES[roleIndex];
//     let timeout: NodeJS.Timeout;

//     if (isDeleting) {
//       if (displayedText.length > 0) {
//         timeout = setTimeout(() => {
//           setDisplayedText(currentRole.slice(0, displayedText.length - 1));
//         }, 35);
//       } else {
//         // Move to next word and start typing
//         setIsDeleting(false);
//         setRoleIndex((prev) => (prev + 1) % ROLES.length);
//       }
//     } else {
//       if (displayedText.length < currentRole.length) {
//         timeout = setTimeout(() => {
//           setDisplayedText(currentRole.slice(0, displayedText.length + 1));
//         }, 75);
//       } else {
//         // Full word typed, pause before deleting
//         setIsPaused(true);
//         timeout = setTimeout(() => {
//           setIsPaused(false);
//           setIsDeleting(true);
//         }, 2200);
//       }
//     }

//     return () => clearTimeout(timeout);
//   }, [displayedText, isDeleting, isPaused, roleIndex, prefersReducedMotion]);

//   return (
//     <div className="flex items-center min-h-[34px] sm:min-h-[40px]">
//       <span className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#CBD5E1] tracking-tight">
//         {displayedText}
//       </span>
//       {!prefersReducedMotion && (
//         <span
//           className="inline-block w-[3px] h-[20px] sm:h-[26px] ml-1.5 bg-gradient-to-b from-[#8B5CF6] to-[#38BDF8] rounded-full animate-pulse"
//           aria-hidden="true"
//         />
//       )}
//     </div>
//   );
// }
