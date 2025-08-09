import Image from "next/image";
import logo from "../../public/assets/Logo-without_bg-02.png"; // Import đường dẫn tới ảnh PNG

export default function Logo() {
  return (
    <Image
      src={logo}    // Gán ảnh được import
      alt="Logo"     // Chú thích hình ảnh
      width={33}     // Chiều rộng cố định
      height={33}    // Chiều cao cố định
    />
  );
}