export type ArticleCategory = 'All' | 'Tech News' | 'Ethical Hacking' | 'AI Tools' | 'Digital Library';

export interface Article {
  id: number;
  title: string;
  summary: string;
  category: 'Tech News' | 'Ethical Hacking' | 'AI Tools' | 'Digital Library';
  imageUrl: string;
  author: {
    id: number;
    name: string;
  };
  date: string;
  content?: string;
}