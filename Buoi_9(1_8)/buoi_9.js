function loadTable() {
  $('#employeeTable').empty();

  data.forEach((nv, index) => {
    let hoatdongHTML = nv.hoatdong
      ? '<i class="fa fa-check"></i>'
      : '<i class="fa fa-times"></i>';

    $('#employeeTable').append(`
      <tr>
        <td class="text-center">
          <button class="btn-action btn-view" title="Xem"><i class="fa fa-eye"></i></button>
          <button class="btn-action btn-edit" title="Sửa"><i class="fa fa-edit"></i></button>
          <button class="btn-action btn-delete" title="Xóa" onclick="xoaNhanVien(${index})"><i class="fa fa-trash"></i></button>
        </td>
        <td class="text-center">${index + 1}</td>
        <td>${nv.ten}</td>
        <td>${nv.hodem}</td>
        <td>${nv.diachi}</td>
        <td class="text-center">${hoatdongHTML}</td>
      </tr>
    `);
  });

  $('#soLuong').text(data.length);
}

function themNhanVien() {
  let ten = $('#ten').val().trim();
  let hodem = $('#hodem').val().trim();
  let diachi = $('#diachi').val().trim();
  let loi = '';

  if (!ten || !hodem || !diachi) {
    loi = 'Không được bỏ trống các trường!';
  } else if (ten.length > 15) {
    loi = 'Tên không được quá 15 ký tự!';
  } else if (hodem.length > 20) {
    loi = 'Họ đệm không được quá 20 ký tự!';
  } else if (diachi.length > 50) {
    loi = 'Địa chỉ không được quá 50 ký tự!';
  }

  if (loi) {
    $('#thongbao').text(loi);
  } else {
    data.push({ ten, hodem, diachi, hoatdong: true });
    loadTable();
    $('#popupForm').modal('hide');
    $('#formAdd')[0].reset();
    $('#thongbao').text('');
  }
}

function xoaNhanVien(index) {
  if (confirm("Bạn có chắc chắn muốn xóa nhân viên này không?")) {
    data.splice(index, 1);
    loadTable();
  }
}

function search() {
  let keyword = $('#searchInput').val().toLowerCase();
  $('#employeeTable').empty();

  let count = 0;
  data.forEach((nv, index) => {
    if (
      nv.ten.toLowerCase().includes(keyword) ||
      nv.hodem.toLowerCase().includes(keyword) ||
      nv.diachi.toLowerCase().includes(keyword)
    ) {
      count++;
      let hoatdongHTML = nv.hoatdong
        ? '<i class="fa fa-check"></i>'
        : '<i class="fa fa-times"></i>';

      $('#employeeTable').append(`
        <tr>
          <td class="text-center">
            <button class="btn-action btn-view"><i class="fa fa-eye"></i></button>
            <button class="btn-action btn-edit"><i class="fa fa-edit"></i></button>
            <button class="btn-action btn-delete" onclick="xoaNhanVien(${index})"><i class="fa fa-trash"></i></button>
          </td>
          <td class="text-center">${index + 1}</td>
          <td>${nv.ten}</td>
          <td>${nv.hodem}</td>
          <td>${nv.diachi}</td>
          <td class="text-center">${hoatdongHTML}</td>
        </tr>
      `);
    }
  });

  $('#soLuong').text(count);
}

$(document).ready(function () {
  loadTable();
});
