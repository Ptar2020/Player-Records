import Swal from "sweetalert2";
import swal from "sweetalert";

export const showErrorMsg = (msg: string) => {
  swal({
    icon: "warning",
    title: msg,
  });
};

export const showSuccessMsg = (msg: string) => {
  Swal.fire({
    icon: "success",
    toast: true,
    title: msg,
    timer: 2200,
    showConfirmButton: false,
    position: "center",
    width: 330,
    // padding: 1,
    // color: 'red'
  });
};
