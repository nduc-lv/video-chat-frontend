"use client"

import { useRouter } from "next/navigation";



interface Interests{

}
interface Offer{
  id: string,
  interests: Interests
}



export default function Home() {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col h-full items-stretch justify-center items-center text-center px-[30%]">
        <div>
          <div className="text-6xl">Welcome</div>
        </div>
        <div>
          <p style={{color:"#6B6666"}} className="text-2xl my-8">Connect with random people sharing the same interests as you</p>
        </div>
        <div>
          <button onClick={() => router.push("/profileSetup")} className="bg-blue-500 text-white text-2xl px-24 text-center py-4 rounded-md hover:bg-blue-700">FIND A MATCH</button>
        </div>
      </div>
    </>
  );
}
