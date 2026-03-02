import { ENV } from "../config/env.js";

export const validateAddress = async (req, res) => {
  try {
    const { userAddress } = req.body;

    const regionCode = "US";
    const { userCity, userStreetAddress, userState } = userAddress;

    if (!userCity || !userStreetAddress || userStreetAddress.length === 0) {
      return res.status(400).json({ message: "Invalid address format" });
    }
    const result = await fetch(
      `${ENV.GOOGLE_ADDRESS_API_BASE_URL}${ENV.GOOGLE_ADDRESS_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: {
            regionCode,
            locality: userCity,
            addressLines: [userStreetAddress],
            administrativeArea: userState,
          },
        }),
      },
    );

    if (!result.ok) {
      const errorData = await result.json();
      return res
        .status(result.status)
        .json({ message: "Address validation failed", error: errorData });
    }

    const data = await result.json();
    const verdict = data.result.verdict;
    const isValid =
      verdict.addressComplete &&
      verdict.validationGranularity !== "OTHER" &&
      verdict.validationGranularity !== "ROUTE";

    if (!isValid) {
      return res.status(404).json({ message: "Invalid address" });
    }

    const {
      locality: city,
      administrativeArea: state,
      addressLines,
      postalCode: zipCode,
    } = data.result.address.postalAddress;
    const address = { city, state, streetAddress: addressLines[0], zipCode };

    return res
      .status(200)
      .json({ data: address, message: "Address is valid and formatted." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
    console.error("Error in validateAddress controller: ", error);
  }
};
