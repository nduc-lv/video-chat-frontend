import { useRef, useEffect } from "react"

interface Props{
    stream: MediaStream,
    width: string,
    muted: boolean,
    height:string,
}

export default function Video({stream, width, muted, height}: Props) {
    const ref = useRef<HTMLVideoElement>();
    useEffect(() => {
        if (ref.current && stream){
            ref.current.srcObject = stream;
            ref.current.addEventListener("loadeddata", () => {
                ref.current?.play();
            })
        }
    }, [stream]);
    return (
        <>
             <div className="h-full">
                    <div className="w-full h-full rounded-3xl shadow-2xl aspect-video bg-black overflow-hidden">
                            <video width={width} muted={muted} style={{objectFit: "cover"}} ref={ref}>
                            </video>
                </div>
            </div>
        </>
    )
}