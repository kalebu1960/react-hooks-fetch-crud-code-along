import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { server } from "../mocks/server";
import ShoppingList from "../components/ShoppingList";

describe("ShoppingList", () => {
  test("displays loading state initially", () => {
    render(<ShoppingList />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  test("displays items after loading", async () => {
    render(<ShoppingList />);
    const yogurt = await screen.findByText("Yogurt");
    const pomegranate = await screen.findByText("Pomegranate");

    expect(yogurt).toBeInTheDocument();
    expect(pomegranate).toBeInTheDocument();
  });

  test("handles API errors", async () => {
    // 👇 Override the mock handler to simulate an error
    server.use(
      rest.get("http://localhost:4000/items", (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<ShoppingList />);

    // 👇 Expect error to appear
    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument();
    });
  });

  test("adds new item", async () => {
    render(<ShoppingList />);

    const nameInput = screen.getByLabelText(/name/i);
    const categorySelect = screen.getByLabelText(/category/i);
    const submitButton = screen.getByText(/add to list/i);

    // Fill out form
    await userEvent.type(nameInput, "Bread");
    await userEvent.selectOptions(categorySelect, "Bakery");
    await userEvent.click(submitButton);

    // Wait for item to appear
    expect(await screen.findByText("Bread")).toBeInTheDocument();
  });
});

