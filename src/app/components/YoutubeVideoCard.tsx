import Card from "antd/es/card/Card";
import Image from "next/image";
export default function YoutubeVideoCard({videoId, snippet}:any){
    return (
        <>
    <Card style={{backgroundColor:"#151B24"}} bodyStyle={{padding: "0", borderColor:"none", display:"flex", flexDirection:"column"}} hoverable={true}>
      <div className="" data-videoid={videoId}>
        <img alt="video" width={snippet?.thumbnails?.medium.width} height={snippet?.thumbnails?.medium.height} data-videoid={videoId} src={snippet?.thumbnails?.medium.url} />
      </div>
      <div className="custom-card"  style={{}}data-videoid={videoId}>
        <h3 data-videoid={videoId} style={{marginTop:"15px", height:"50px", paddingLeft:"10px",textOverflow:"ellipsis", color:"white", overflow:"clip", width:snippet?.thumbnails?.medium.width}}>{snippet?.title}</h3>
      </div>
    </Card>
        </>
    )
}