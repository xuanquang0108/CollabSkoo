'use client';
import { useState } from 'react';
import styles from './FAQ.module.css';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    {
      question: "CollabSkoo là gì?",
      answer: "CollabSkoo là nơi sinh viên tụi mình chia sẻ tài liệu học tập. Tài liệu có thể là bài giảng, đề cương, bài tập – miễn là giúp ích cho nhau."
    },
    {
      question: "Tôi có cần đăng ký để đóng góp tài liệu không?",
      answer: "Không cần đăng ký gì cả."
    },
    {
      question: "Đóng góp có tốn phí gì không?",
      answer: "Không tốn gì hết. Đây là nền tảng chia sẻ tự nguyện, ai có gì hay thì chia sẻ lên thôi. Cộng đồng là chính!"
    },
    {
      question: "Tôi bị lỗi khi tải hoặc xem tài liệu, phải làm sao?",
      answer: "– Đảm bảo đường truyền Internet ổn định. \n– Thử tải lại trang (Ctrl+F5).\n– Nếu vẫn lỗi, hãy liên hệ qua email glyphnomad28@gmail.com."
    }
  ];

    // Hàm để xử lý xuống dòng trong văn bản
  const formatAnswer = (text: string) => {
    // Tách văn bản thành các dòng dựa trên ký tự \n
    const lines = text.split('\n');

    // Trả về các phần tử JSX với mỗi dòng được phân tách bằng <br />
    return lines.map((line, index) => (
      <span key={index}>
        {line}
        {index < lines.length - 1 && <br />}
      </span>
    ));
  };

  return (
    <section id="faq-section" className={styles.faqSection}>
      <h2>Câu hỏi thường gặp</h2>
      {faqData.map((item, index) => (
        <div
          key={index}
          className={`${styles.faqItem} ${openIndex === index ? styles.open : ''}`}
        >
          <button
            className={styles.faqQuestion}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            {item.question} <span className={styles.plusIcon}>+</span>
          </button>
          <div className={styles.faqAnswer}>
            <p>{formatAnswer(item.answer)}</p>
          </div>
        </div>
      ))}
    </section>
  );
}