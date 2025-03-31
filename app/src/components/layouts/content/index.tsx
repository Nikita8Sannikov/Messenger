import BoxComponent from "@components/ui/box";

interface IContentLayoutProps {
    children: React.ReactNode;
};

export default function ContentLayout({ children }: IContentLayoutProps) {
    return <BoxComponent className="content">{children}</BoxComponent>;
}