import { User } from "../models/user.model.js";

export const addAddress = async (req, res) => {
  try {
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = req.body;

    const user = req.user;

    if (!fullName || !streetAddress || !city || !state || !zipCode) {
      return res.status(400).json({ error: "Missing required address fields" });
    }

    // if this is set as default, unset all other defaults
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault: isDefault || false,
    });

    await user.save();

    return res.status(201).json({
      message: "Address added successfully",
      data: { addresses: user.addresses },
    });
  } catch (error) {
    console.error("Error in addAddress controller: ", error);

    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({
      message: "Address fetched successfully",
      data: { addresses: user.addresses },
    });
  } catch (error) {
    console.error("Error in getAddress controller: ", error);

    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = req.body;
    const { addressId } = req.params;
    const user = req.user;
    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({
        error: "Address not found.",
      });
    }

    // if set as default, unset all other defaults
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    address.label = label || address.label;
    address.fullName = fullName || address.fullName;
    address.streetAddress = streetAddress || address.streetAddress;
    address.city = city || address.city;
    address.state = state || address.state;
    address.zipCode = zipCode || address.zipCode;
    address.phoneNumber = phoneNumber || address.phoneNumber;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    await user.save();

    return res.status(200).json({
      message: "Address updated successfully",
      data: { addresses: user.addresses },
    });
  } catch (error) {
    console.error("Error in updateAddress controller: ", error);

    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = req.user;

    user.addresses.pull(addressId);
    await user.save();

    return res.status(200).json({
      message: "Address deleted successfully",
      data: { addresses: user.addresses },
    });
  } catch (error) {
    console.error("Error in deleteAddress controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    // check if product is already in the wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        error: "Product already in wishlist",
      });
    }

    user.wishlist.push(productId);
    await user.save();

    return res.status(200).json({
      message: "Product added to wishlist",
      data: { wishlist: user.wishlist },
    });
  } catch (error) {
    console.error("Error in addToWishlist controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = req.user;

    // check if product is already in the wishlist

    if (!user.wishlist.includes(productId)) {
      return res.status(400).json({
        error: "This product is not in your wishlist.",
      });
    }

    user.wishlist.pull(productId);
    await user.save();

    return res.status(200).json({
      message: "Item removed from wishlist successfully.",
      data: { wishlist: user.wishlist },
    });
  } catch (error) {
    console.error("Error in removeFromWishlist controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getWishlist = async (req, res) => {
  try {
    // use populate() to fetch information about the wishlist (not just ids )
    const user = await User.findById(req.user._id).populate("wishlist");

    return res.status(200).json({
      message: "Wishlist fetched successfully.",
      user: { wishlist: user.wishlist },
    });
  } catch (error) {
    console.error("Error in getWishlist controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
