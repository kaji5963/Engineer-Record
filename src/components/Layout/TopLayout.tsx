import TopHeader from "../TopHeader";

type LayoutProps = {
  children: any
}

const TopLayout = ({ children }: LayoutProps) => {
  return (
    <div>
      <TopHeader />
      {children}
    </div>
  );
};

export default TopLayout;