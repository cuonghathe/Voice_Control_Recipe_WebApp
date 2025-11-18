import React from 'react'
import Paragraph from './components/Paragraph'
import Picture from './components/Picture'
import Container from "react-bootstrap/Container";
import "./info.scss"



const InfoPage = () => {
  const articleData = {
    title: "Hướng dẫn sử dụng các công nghệ mới",
    content: [
      { key: "paragraph", data: `Chế độ Điều khiển bằng giọng nói cho phép bạn thao tác trang mà không cần chạm tay.
        Khi bật lên, hệ thống sẽ lắng nghe giọng nói của bạn và thực hiện các thao tác tương ứng.
        Tính năng này giúp bạn theo dõi công thức dễ dàng, rảnh tay và an toàn hơn trong quá trình nấu ăn. 
        Dưới đây là hướng dẫn cách sử dụng công nghệ này` },
      { key: "paragraph", data: `Bước 1: Truy cập vào trang chi tiết công thức, nhấn vào biểu tượng ở góc cuối bên phải
         màn hình để mở menu điều khiển giọng nói` },
      { key: "picture", data: require("./Pictures/VoiceControl1.png") },
      { key: "paragraph", data: `Bước 2: Lần đầu tiên sử dụng, hệ thống sẽ yêu cầu cấp quyền truy cập micro; 
        người dùng chỉ cần chọn “Cho phép” để tiếp tục.` },
      { key: "picture", data: require("./Pictures/VoiceControl2.png") },
      { key: "picture", data: require("./Pictures/VoiceControl3.png") },
      { key: "paragraph", data: `Bước 3: Sau khi được kích hoạt, website sẽ tự động lắng nghe và nhận diện câu 
        lệnh bằng tiếng Việt, sau đó thực hiện các hành động tương ứng như chuyển bước nấu, tăng hoặc giảm số 
        suất ăn, hoặc cuộn trang. Lưu ý: bạn cần nói đúng theo các câu lệnh được liệt kê bên dưới để hệ thống 
        nhận diện và phản hồi chính xác.`},
      { key: "picture", data: require("./Pictures/VoiceControl4.png") },
      { key: "paragraph", data: `Khi không muốn sử dụng nữa, người dùng có thể nhấn nút tắt điều khiển giọng
        nói để dừng hệ thống.`},
      { key: "paragraph", data: `Tính năng TTS (tường thuật văn bản) cho phép website tường thuật các phần 
        văn bản được hỗ trợ`},
      { key: "paragraph", data: `Để sử dụng tính năng tường thuật văn bản, người dùng chỉ cần nhấn vào nút 
        “Đọc” được đặt tại các phần nội dung được hỗ trợ trong trang chi tiết công thức. 
        Trong quá trình tường thuật, nếu người dùng không muốn tiếp tục nghe, chỉ cần nhấn nút “Dừng”,
         hệ thống sẽ dừng phát âm ngay lập tức.`},
      { key: "picture", data: require("./Pictures/TTS1.png") },
      { key: "paragraph", data: `Tính năng Đối thoại cho phép CookBot nói và lắng nghe bạn theo thời gian thực.
      Khi bật lên, CookBot sẽ tự động đọc câu trả lời và nhận diện giọng nói của bạn để tiếp tục cuộc trò chuyện.`},
      { key: "paragraph", data: `Để sử dụng tính năng đối thoại bằng giọng nói với CookBot, người dùng mở khung CookBot 
        ở góc dưới màn hình và nhấn vào nút “Bật đối thoại”. 
        Khi tính năng được kích hoạt, hệ thống sẽ bật chế độ nhận diện giọng nói và lắng nghe câu hỏi của người dùng. 
        Khi người dùng dừng nói trong một khoảng thời gian ngắn, 
        hệ thống sẽ tự động chuyển câu nói thành văn bản và gửi câu hỏi đó vào CookBot để xử lý.`},
      { key: "picture", data: require("./Pictures/VocalCom1.png") },
      { key: "picture", data: require("./Pictures/VocalCom2.png") },
    ]
  };

  const { title, content } = articleData;

  return (
    <Container>      
      <div className="info-page">
        <div className="info-page__container">
          {title && (
            <h1 className="info-page__title">{title}</h1>
          )}
          
          <div className="info-page__content">
            {content && content.map((item, index) => {
              if (item.key === "paragraph") {
                return <Paragraph key={index} paragraphInfo={item.data} />
              } else if (item.key === "picture") {
                return <Picture key={index} pictureLink={item.data} alt={item.alt || `Article image ${index + 1}`} />
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </Container>
  )
}

export default InfoPage
