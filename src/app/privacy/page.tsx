export default function PrivacyPage() {
  return (
    <div className="flex justify-center cursor-default">
        <div className="w-full !px-4 !py-10 max-w-4xl mx-auto">
          <h1 className="!text-2xl !font-bold !m-4 uppercase items-center justify-center flex">Chính sách bảo mật</h1>

          <p className="italic !mb-4">Cập nhật lần cuối: 08/08/2025</p>

          <p className="mb-4">
            Tại <strong className="text-primary">CollabSkoo</strong>, chúng tôi cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của người dùng. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.
          </p>

          <h2 className="!text-xl !font-semibold !mt-6 !mb-2">1. Thông tin chúng tôi thu thập</h2>
          <ul className="!list-disc !pl-6 !mb-4 !space-y-1">
            <li>Thông tin cá nhân: tên, email, thông tin đăng nhập, ảnh đại diện.</li>
            <li>Hoạt động sử dụng: lượt tải, điểm đóng góp, lịch sử tìm kiếm.</li>
            <li>Dữ liệu kỹ thuật: loại thiết bị, trình duyệt, IP, v.v.</li>
          </ul>

          <h2 className="!text-xl !font-semibold !mt-6 !mb-2">2. Mục đích sử dụng thông tin</h2>
          <ul className="!list-disc !pl-6 !mb-4 !space-y-1">
            <li>Cung cấp và cải thiện trải nghiệm người dùng.</li>
            <li>Hiển thị bảng xếp hạng, tính điểm và xác nhận đóng góp.</li>
            <li>Gửi thông báo liên quan đến tài khoản hoặc hoạt động cộng đồng.</li>
            <li>Bảo vệ hệ thống và ngăn chặn hành vi gian lận.</li>
          </ul>

          <h2 className="!text-xl !font-semibold !mt-6 !mb-2">3. Bảo mật thông tin</h2>
          <p className="!mb-4">
            Chúng tôi áp dụng các biện pháp kỹ thuật và quản lý để bảo vệ dữ liệu. Dữ liệu không được chia sẻ với bên thứ ba trừ khi có sự đồng ý của bạn hoặc yêu cầu pháp luật.
          </p>

          <h2 className="!text-xl !font-semibold !mt-6 !mb-2">4. Quyền của bạn</h2>
          <p className="!mb-4">
            Bạn có quyền xem, chỉnh sửa hoặc xoá thông tin cá nhân bất kỳ lúc nào. Bạn cũng có thể yêu cầu xoá tài khoản và toàn bộ dữ liệu liên quan.
          </p>

          <p>Nếu bạn có thắc mắc, hãy liên hệ: <a className="!underline !text-primary" href="mailto:glyphnomad28@gmail.com">glyphnomad28@gmail.com</a></p>
        </div>
    </div>
  );
}