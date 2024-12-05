import { useRef, useEffect } from "react"

interface Props{
    stream: MediaStream,
    width: string,
    muted: boolean,
    height:string,
    toggle: boolean
}

export default function Video({stream, width, muted, height, toggle}: Props) {
    if (toggle !== false) {
        toggle = true
    }
    const ref = useRef<any>();
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
                        {(toggle) || <div style={{zIndex: 10}} className="w-full h-full"></div>}
                            <video width={width} muted={muted} style={{objectFit: "cover"}} ref={ref}>
                            </video>
                </div>
            </div>
        </>
    )
}