import AuthHeader from "../AuthHeader";

type LayoutProps = {
  children: any
}

const AuthLayout = ({ children }: LayoutProps) => {
  return (
    <div>
      <AuthHeader />
      {children}
    </div>
  );
};

export default AuthLayout;