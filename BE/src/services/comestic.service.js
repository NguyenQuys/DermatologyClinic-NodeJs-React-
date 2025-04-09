const _repository = require("../repositories/sub.repository");

class ComesticService {
  async getAll() {
    return await _repository.comesticRepository.getAll();
  }

  async getById(id) {
    const comesticToGet = await _repository.comesticRepository.getById(id);
    if (!comesticToGet)
      throw Object.assign(new Error("Sản phẩm không tồn tại"), { status: 404 });

    if (comesticToGet.reviews && Array.isArray(comesticToGet.reviews)) {
      comesticToGet.reviews.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // explain in doc file
      );
    }

    return comesticToGet;
  }

  async searchByName(comesticName) {
    const cosmestic = await _repository.comesticRepository.searchByName(
      comesticName
    );

    if (cosmestic.length === 0) {
      throw Object.assign(new Error("Không tìm thấy sản phẩm"), {
        status: 404,
      });
    }

    return cosmestic;
  }

  async sortByPrice(type) {
    const sortedList = await _repository.comesticRepository.sortByPrice(type);
    return sortedList;
  }

  async add(entity) {
    // Validate tên sản phẩm
    if (!entity.name || entity.name.trim().length < 2) {
      throw Object.assign(new Error("Tên sản phẩm phải có ít nhất 2 ký tự"), {
        status: 400,
      });
    }

    // Kiểm tra tên sản phẩm đã tồn tại
    const existingComestic = await _repository.comesticRepository.getByName(
      entity.name
    );
    if (existingComestic) {
      throw Object.assign(new Error("Sản phẩm này đã tồn tại trước đó"), {
        status: 400,
      });
    }

    // Validate danh mục
    if (!entity.category || entity.category.trim().length < 2) {
      throw Object.assign(new Error("Danh mục sản phẩm không hợp lệ"), {
        status: 400,
      });
    }

    // Validate giá
    if (!entity.price || entity.price <= 0) {
      throw Object.assign(new Error("Giá sản phẩm phải lớn hơn 0"), {
        status: 400,
      });
    }

    // Validate số lượng
    if (!entity.quantity) {
      throw Object.assign(
        new Error("Số lượng sản phẩm không không được để trống"),
        {
          status: 400,
        }
      );
    } else if (entity.quantity < 0) {
      throw Object.assign(new Error("Số lượng sản phẩm không hợp lệ"), {
        status: 400,
      });
    }

    // Validate hình ảnh
    if (!entity.image) {
      throw Object.assign(new Error("Vui lòng thêm hình ảnh sản phẩm"), {
        status: 400,
      });
    }

    // Kiểm tra định dạng file ảnh
    const validImageExtensions = ["jpg", "jpeg", "png", "gif"];
    const imageExtension = entity.image.split(".").pop().toLowerCase();
    if (!validImageExtensions.includes(imageExtension)) {
      throw Object.assign(
        new Error(
          "Định dạng ảnh không hợp lệ. Chỉ chấp nhận: jpg, jpeg, png, gif"
        ),
        { status: 400 }
      );
    }

    // Xử lý đường dẫn ảnh
    //entity.image = `/src/assets/general/${entity.image}`;

    // Thêm sản phẩm mới
    await _repository.comesticRepository.add(entity);
    return "Thêm sản phẩm thành công";
  }

  async update(id, entity) {
    // Kiểm tra ID có tồn tại
    if (!id) {
      throw Object.assign(new Error("ID sản phẩm không được để trống"), {
        status: 400,
      });
    }

    // Kiểm tra sản phẩm có tồn tại không
    const existingProduct = await _repository.comesticRepository.getById(id);
    if (!existingProduct) {
      throw Object.assign(new Error("Không tìm thấy sản phẩm"), {
        status: 404,
      });
    }

    // Validate trống input
    if (entity.name === "") {
      throw Object.assign(new Error("Tên sản phẩm không được để trống"), {
        status: 400,
      });
    }

    // Validate tên sản phẩm nếu có thay đổi
    if (entity.name && entity.name !== existingProduct.name) {
      if (entity.name.trim().length < 2) {
        throw Object.assign(new Error("Tên sản phẩm phải có ít nhất 2 ký tự"), {
          status: 400,
        });
      }

      // Kiểm tra tên mới có trùng với sản phẩm khác không
      const existingComestic = await _repository.comesticRepository.getByName(
        entity.name
      );
      if (existingComestic) {
        throw Object.assign(new Error("Tên sản phẩm này đã tồn tại"), {
          status: 400,
        });
      }
    }

    // Validate danh mục nếu có thay đổi
    if (!entity.category) {
      throw Object.assign(new Error("Danh mục sản phẩm không được để trống"), {
        status: 400,
      });
    } else if (entity.category.trim().length < 2) {
      throw Object.assign(new Error("Danh mục sản phẩm không hợp lệ"), {
        status: 400,
      });
    }

    // Validate giá nếu có thay đổi
    if (entity.price && entity.price <= 0) {
      throw Object.assign(new Error("Giá sản phẩm phải lớn hơn 0"), {
        status: 400,
      });
    }

    // Validate số lượng nếu có thay đổi
    if (entity.quantity !== undefined && entity.quantity < 0) {
      throw Object.assign(new Error("Số lượng sản phẩm không hợp lệ"), {
        status: 400,
      });
    }

    // Validate hình ảnh nếu có thay đổi
    if (entity.image) {
      // Kiểm tra định dạng file ảnh
      const validImageExtensions = ["jpg", "jpeg", "png", "gif"];
      const imageExtension = entity.image.split(".").pop().toLowerCase();
      if (!validImageExtensions.includes(imageExtension)) {
        throw Object.assign(
          new Error(
            "Định dạng ảnh không hợp lệ. Chỉ chấp nhận: jpg, jpeg, png, gif"
          ),
          { status: 400 }
        );
      }

      // Xử lý đường dẫn ảnh
      //entity.image = `/src/assets/general/${entity.image}`;
    }

    // Cập nhật sản phẩm
    await _repository.comesticRepository.update(id, entity);
    return "Cập nhật sản phẩm thành công";
  }

  async delete(id) {
    await _repository.comesticRepository.delete(id);
    return "Đã xóa thành công";
  }
}

module.exports = new ComesticService();
