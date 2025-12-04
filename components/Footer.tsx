import Image from "next/image";

export default function Footer() {
  return (
    <footer className="py-5 bg-white border-b border-gray-200 sticky text-center text-sm border-t mt-auto flex items-center justify-center gap-2">
      <span className="text-gray-500">Legacy Innovations — 2025 ©</span>

      <Image
        src="/simpleHunt.png"
        alt="Simple Hunt Logo"
        width={120}
        height={60}
      />
    </footer>
  );
}