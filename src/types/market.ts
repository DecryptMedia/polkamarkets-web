export type MarketState = 'open' | 'closed' | 'resolved';

export type News = {
  source: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
};

export type Comment = {
  id: number;
  content: string;
  contentAt: string;
  user: {
    username: string;
    avatar: string;
  };
};
