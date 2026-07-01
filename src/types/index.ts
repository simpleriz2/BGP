export type ProductItem = {
  id: string;
  title: string;
  description?: string;
  advantages?: string[];
  disadvantages?: string[];
  applications?: string[];
  image: string;
};

export type FittingItem = {
  id: string;
  title: string;
  image: string;
  desc?: string;
};

export type StatItem = {
  value: string;
  label: string;
};

export type ProjectItem = {
  title: string;
  description?: string;
  image?: string;
};
