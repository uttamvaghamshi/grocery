import Address from "../models/Address.js";


export const createAddress = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    const { house_no, street, country, city, state, pincode } = req.body;

    const address = await Address.create({
      user_id: req.user._id,
      house_no,
      street,
      country,
      city,
      state,
      pincode
    });

    res.status(201).json({
      success: true,
      message: "Address created successfully",
      address
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
}


export const getUserAddresses = async (req, res) => {
  try {

    const addresses = await Address.find({
      user_id: req.user._id
    });

    res.status(200).json({
      success: true,
      count: addresses.length,
      addresses
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};



// GET SINGLE ADDRESS
export const getSingleAddress = async (req, res) => {
  try {

    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({
        message: "Address not found"
      });
    }

    res.status(200).json({
      success: true,
      address
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};


export const updateAddress = async (req, res) => {
  try {

    const address = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!address) {
      return res.status(404).json({
        message: "Address not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};


export const deleteAddress = async (req, res) => {
  try {

    const address = await Address.findByIdAndDelete(req.params.id);

    if (!address) {
      return res.status(404).json({
        message: "Address not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};