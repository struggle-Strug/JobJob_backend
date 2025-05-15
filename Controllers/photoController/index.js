const CustomerModel = require("../../Models/CustomerModel");
const PhotoModel = require("../../Models/PhotoModel");

exports.save = async (req, res) => {
  try {
    const { companyName } = req.body;
    const photos = await PhotoModel.findOne({
      companyName: companyName,
    });

    if (photos == null) {
      const newPhotos = new PhotoModel({
        companyName: companyName,
        images: [],
      });

      await newPhotos.save();
      return res.json({ message: "保存しました", photos: newPhotos });
    }

    return res.json({ message: "写真を追加しました", photos });
  } catch (error) {
    return res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.getPhotosByCustomerId = async (req, res) => {
  try {
    const customer = await CustomerModel.findOne({
      customer_id: req.user.data.customer_id,
    });

    const photos = await PhotoModel.findOne({
      companyName: customer.companyName,
    });

    return res.json({ message: "取得しました", photos: photos });
  } catch (error) {
    return res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.updateDescription = async (req, res) => {
  try {
    const { description } = req.body;
    const photoId = req.params.id;

    const customer = await CustomerModel.findOne({
      customer_id: req.user.data.customer_id,
    });

    const photos = await PhotoModel.findOne({
      companyName: customer.companyName,
    });

    const photo = photos.images.find(
      (photo) => photo._id.toString() === photoId
    );

    if (!photo) {
      return res.status(404).json({ message: "写真が見つかりません" });
    }

    photo.description = description;
    await photos.save();

    return res.json({ message: "写真の説明を更新しました", photos });
  } catch (error) {
    return res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.updateImages = async (req, res) => {
  try {
    const customer = await CustomerModel.findOne({
      customer_id: req.user.data.customer_id,
    });
    const photos = await PhotoModel.findOne({
      companyName: customer.companyName,
    });

    photos.images = [
      ...photos.images,
      ...req.body.map((image) => ({
        photoName: image.fileName,
        photoUrl: image.fileUrl,
        description: "",
      })),
    ];
    await photos.save();

    return res.json({ message: "写真を削除しました", photos });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "サーバーエラー", error: true });
  }
};

exports.deleteImageByCustomerId = async (req, res) => {
  try {
    const customer = await CustomerModel.findOne({
      customer_id: req.user.data.customer_id,
    });
    const photos = await PhotoModel.findOne({
      companyName: customer.companyName,
    });
    const backendUrl = `${req.protocol}://${req.get("host")}`;
    const imageNameToDelete = `${backendUrl}/uploads/${req.params.imageName}`;

    const filteredImages = photos.images.filter(
      (img) => img.photoUrl !== imageNameToDelete
    );
    photos.images = filteredImages;
    await photos.save();
    return res.json({ message: "写真を更新しました", photos });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "サーバーエラー", error: true });
  }
};
