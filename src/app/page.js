import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <Link href="/postes">
          
          <h2 className="mb-3 text-2xl font-semibold">
            Start{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Start your journey !
          </p>
        </Link>
      </div>
    </main>
  );
}
