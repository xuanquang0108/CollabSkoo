// File: app/terms/page.tsx
export default function TermsPage() {
  return (
    <div className="flex justify-center cursor-default">
        <div className="w-full !px-4 !py-10 max-w-4xl mx-auto">
          <h1 className="!text-2xl !font-bold !m-3 uppercase items-center justify-center flex">Điều khoản sử dụng</h1>

          <p className="italic !mb-4">Cập nhật lần cuối: 08/08/2025</p>

          <p className="mb-4">
            Chào mừng bạn đến với <strong className="text-primary">CollabSkoo</strong> - nền tảng chia sẻ và tìm kiếm tài liệu học tập dành cho sinh viên!
          </p>

          <h2 className="!text-xl !font-semibold !mt-6 !mb-2">1. Tài khoản người dùng</h2>
          <ul className="!list-disc !pl-6 !mb-4 !space-y-1">
            <li>Bạn cần cung cấp thông tin chính xác khi đăng ký tài khoản.</li>
            <li>Mỗi người chỉ được sử dụng một tài khoản duy nhất.</li>
            <li>Bạn có trách nhiệm bảo mật thông tin đăng nhập và chịu trách nhiệm cho mọi hoạt động diễn ra trong tài khoản của mình.</li>
          </ul>

          <h2 className="!text-xl !font-semibold !mt-6 !mb-2">2. Quy định về nội dung tài liệu</h2>
          <ul className="!list-disc !pl-6 !mb-4 !space-y-1">
            <li>Bạn chỉ được phép đăng tải các tài liệu mà bạn có quyền chia sẻ.</li>
            <li>Nghiêm cấm đăng tải nội dung vi phạm pháp luật, bản quyền hoặc chứa thông tin độc hại.</li>
            <li>Chúng tôi có quyền xoá hoặc ẩn các nội dung vi phạm mà không cần báo trước.</li>
          </ul>

          <h2 className="!text-xl !font-semibold !mt-6 !mb-2">3. Quyền sử dụng nội dung</h2>
          <p className="!mb-4">
            Khi bạn chia sẻ tài liệu trên Skoo, bạn đồng ý cấp cho chúng tôi quyền sử dụng nội dung đó để hiển thị, phân phối và quảng bá trong phạm vi cộng đồng học tập.
          </p>

          <h2 className="!text-xl !font-semibold !mt-6 !mb-2">4. Trách nhiệm và miễn trừ</h2>
          <p className="!mb-4">
            Skoo không chịu trách nhiệm cho độ chính xác, tính hợp pháp hay cập nhật của các tài liệu do người dùng chia sẻ. Người dùng tự chịu trách nhiệm khi sử dụng.
          </p>

          <h2 className="!text-xl !font-semibold !mt-6 !mb-2">5. Thay đổi và chấm dứt</h2>
          <p>
            Chúng tôi có quyền cập nhật điều khoản bất kỳ lúc nào. Tài khoản vi phạm có thể bị hạn chế hoặc xoá bỏ vĩnh viễn.
          </p>
        </div>
    </div>

  );
}
