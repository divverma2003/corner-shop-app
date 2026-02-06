import { useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  XIcon,
  ImageIcon,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../lib/api.js";
import { getStockStatusBadge } from "../lib/utils.js";
import { categories } from "../lib/constants.js";
import toast from "react-hot-toast";

const ProductsPage = () => {
  const [showModal, setShowModal] = useState(false);
  // the state to track if we are editing a product, and which one
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const queryClient = useQueryClient();

  // fetch some data
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: productApi.getAll,
  });

  // creating, update, deleting
  const createProductMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      // upon success, close modal and refetch products list by
      // invalidating the products query and letting it run again
      // purpose: to update the list in UI

      closeModal();
      toast.success("Product created successfully!");

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
    onError: (error) => {
      Sentry.captureException(error, {
        tags: { component: "ProductsPage" },
        extra: { context: "create_product" },
      });
      toast.error("Failed to create product. Please try again.");
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: productApi.update,
    // upon success, close modal and refetch products list by
    // invalidating the products query and letting it run again
    onSuccess: () => {
      toast.success("Product updated successfully!");
      closeModal();
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
    onError: (error) => {
      toast.error("Failed to update product. Please try again.");
      Sentry.captureException(error, {
        tags: { component: "ProductsPage" },
        extra: { context: "update_product" },
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      closeModal();
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
    onError: (error) => {
      toast.error("Failed to delete product. Please try again.");
      Sentry.captureException(error, {
        tags: { component: "ProductsPage" },
        extra: { context: "delete_product" },
      });
    },
  });

  const closeModal = () => {
    // reset form data
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
    });
    // Revoke blob URLs to prevent memory leaks
    imagePreviews.forEach((url) => {
      if (url.startsWith("blob:")) URL.revokeObjectURL(url);
    });

    setImages([]);
    setImagePreviews([]);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);

    // populate form data
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
    });

    setImagePreviews(product.images || []);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const totalImages =
      images.length +
      // count how many of the current previews are blobs (newly added) vs existing urls
      imagePreviews.filter((p) => !p.startsWith("blob:")).length +
      files.length;
    if (totalImages > 3) {
      toast.error("Maximum 3 images allowed");
      return;
    }

    setImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);

    // reset file input so the same file can be re-selected if removed
    e.target.value = null;
  };

  const handleRemoveImage = (index) => {
    const preview = imagePreviews[index];
    const isBlob = preview.startsWith("blob:");

    // if it's a blob url, we need to revoke it and remove the corresponding file from images state
    if (isBlob) {
      URL.revokeObjectURL(preview);
      // find the index within the new-files array
      const blobIndex =
        imagePreviews.slice(0, index + 1).filter((p) => p.startsWith("blob:"))
          .length - 1;
      setImages((prev) => prev.filter((_, i) => i !== blobIndex));
    }

    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // for new product, images are required
    if (!editingProduct && images.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("stock", formData.stock);
    formDataToSend.append("category", formData.category);

    // only append new images if they were selected
    if (images.length > 0) {
      images.forEach((image) => {
        // key name should match what backend expects
        formDataToSend.append("images", image);
      });
    }

    if (editingProduct) {
      updateProductMutation.mutate({
        id: editingProduct._id,
        formData: formDataToSend,
      });
    } else {
      createProductMutation.mutate(formDataToSend);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-base-content/70 mt-1">
            Manage your products here. You can add, edit, or delete products as
            needed.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary gap-2"
        >
          <PlusIcon className="size-5" />
          Add Product
        </button>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="grid grid-cols-1 gap-4">
        {products?.map((product) => {
          const status = getStockStatusBadge(product.stock);
          return (
            <div key={product._id} className="card bg-base-100 shadow-xl">
              {/* PRODUCT CARD */}

              <div className="card-body">
                {/* PRODUCT PICTURE */}
                <div className="flex items-center gap-6">
                  <div className="avatar">
                    <div className="w-20 rounded-xl">
                      <img
                        src={product?.images[0] || "/placeholder.png"}
                        alt={product.name}
                      ></img>
                    </div>
                  </div>

                  {/* PRODUCT DETAILS & ACTIONS */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="card-title">{product.name}</h3>
                        <p className="text-base-content/70 text-sm">
                          {product.category}
                        </p>
                      </div>
                      <div className={`badge ${status.class}`}>
                        {status.text}
                      </div>
                    </div>
                    <div className="flex items-center gap-6 mt-4">
                      <div>
                        <p className="text-xs text-base-content/70">Price</p>
                        <div className="font-bold text-lg">
                          ${product.price}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-base-content/70">
                          Stock
                        </div>
                        <p className="font-bold text-lg">
                          {product.stock} units
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CARD ACTIONS */}
                  <div className="card-actions">
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => handleEdit(product)}
                    >
                      <PencilIcon className="size-5" />
                    </button>
                    <button
                      className="btn btn-square btn-ghost text-error"
                      onClick={() => deleteProductMutation.mutate(product._id)}
                    >
                      {deleteProductMutation.isPending ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        <Trash2Icon className="size-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD/EDIT PRODUCT MODAL */}
      <input
        type="checkbox"
        className="modal-toggle"
        checked={showModal}
        readOnly
      />
      <div className="modal">
        <div className="modal-box max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-2xl">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h3>

            <button
              onClick={closeModal}
              className="btn btn-sm btn-circle btn-ghost"
            >
              <XIcon className="size-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* TOP ROW: NAME & CATEGORY */}
            <div className="grid grid-cols-2 gap-4">
              {/* NAME INPUT */}
              <div className="form-control">
                <label className="label">
                  <span>Product Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  className="input input-bordered"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* CATEGORY INPUT */}
              <div className="form-control">
                <label className="label">
                  <span>Category</span>
                </label>
                <select
                  className="select select-bordered"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SECOND ROW: PRICE, STOCK */}
            <div className="grid grid-cols-2 gap-4">
              {/* PRICE INPUT */}
              <div className="form-control">
                <label className="label">
                  <span>Price ($)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="input input-bordered"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
              {/* STOCK INPUT */}
              <div className="form-control">
                <label className="label">
                  <span>Stock</span>
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="input input-bordered"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* DESCRIPTION INPUT */}
            <div className="form-control flex flex-col gap-2">
              <label className="label">
                <span>Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24 w-full"
                placeholder="Enter product description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            {/* IMAGE UPLOAD */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Product Images
                </span>
                <span className="label-text-alt text-xs opacity-60">
                  Max 3 images
                </span>
              </label>

              <div className="bg-base-200 rounded-xl p-4 border-2 border-dashed border-base-300 hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="file-input file-input-bordered file-input-primary w-full"
                  required={!editingProduct && imagePreviews.length === 0}
                />

                {editingProduct && (
                  <p className="text-xs text-base-content/60 mt-2 text-center">
                    Leave empty to keep current images
                  </p>
                )}
              </div>

              {imagePreviews.length > 0 && (
                <div className="flex gap-3 mt-3 flex-wrap">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="avatar">
                        <div className="w-20 rounded-lg">
                          <img src={preview} alt={`Preview ${index + 1}`} />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="btn btn-circle btn-xs btn-error absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XIcon className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FORM ACTIONS */}
            <div className="modal-action">
              <button
                type="button"
                onClick={closeModal}
                className="btn"
                disabled={
                  createProductMutation.isPending ||
                  updateProductMutation.isPending
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  createProductMutation.isPending ||
                  updateProductMutation.isPending
                }
              >
                {createProductMutation.isPending ||
                updateProductMutation.isPending ? (
                  <span className="loading loading-spinner"></span>
                ) : editingProduct ? (
                  "Update Product"
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
