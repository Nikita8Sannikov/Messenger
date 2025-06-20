import { act, render, screen } from "@testing-library/react";

import useProfile from "@hooks/useProfile";
import Friends from "@modules/profile/top-friends/friends";
import { mockProfileService } from "../../../../__mocks__/@hooks/useProfile";

jest.mock("@hooks/useProfile");
jest.mock("react-router-dom", () => ({
	useNavigate: () => jest.fn(),
	useParams: () => ({ userId: "1" }),
}));

describe("Friends", () => {
	beforeEach(() => {
		(useProfile as jest.Mock).mockReturnValue(mockProfileService);
	});

	it("renders with no friends", async () => {
		await act(async () => {
			const { container } = render(<Friends />);
			expect(container).toMatchSnapshot();
		});
		expect(screen.getByTestId("no-data")).toBeInTheDocument();
	});

	it("calls getFriendsAndFollowers on mount", async () => {
		await act(async () => {
			render(<Friends />);
		});
		expect(mockProfileService.getFriendsAndFollowers).toHaveBeenCalled();
	});

	it("renders loading state", async () => {
		const { container, rerender } = render(<Friends />);
		expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
        
		const loadingComponent = <Friends />;
		loadingComponent.type.defaultProps = { loading: true };
		await act(async () => {
			rerender(loadingComponent);
		});
		expect(container).toMatchSnapshot();
	});

	it("renders friends count", async () => {
		await act(async () => {
			const { container } = render(<Friends />);
			expect(container).toMatchSnapshot();
		});
		const counter = screen.getByText("Friends").closest(".block-title")?.querySelector(".counter");
		expect(counter).toHaveClass("counter");
		expect(counter).toHaveTextContent("0");
	});

	it("renders friends title", async () => {
		await act(async () => {
			const { container } = render(<Friends />);
			expect(container).toMatchSnapshot();
		});
		expect(screen.getByText("Friends")).toBeInTheDocument();
	});
});
