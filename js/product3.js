var products = null;

window.onload = function () {
    var requestOptions = {
        method: "GET",
        redirect: "follow",
    };

    fetch(YOKULT_URL + PRODUCT + "/?category=保健相關", requestOptions)
        .then((response) => response.text())
        .then((text) => {
            const rep = JSON.parse(text);

            products = rep.products;

            products.forEach((product, idx) => {
                let productHtml = "";

                productHtml = `
     <li>
                <a href="#">
                  <div class="img_block">
                    <img class="img-fluid" src="${product.proPicture}" alt="" />
                  </div>
                </a>
                <div
                  class="position-relative bg-light rounded-bottom text-center p-4"
                >
                  <h5 class="m-0" style="height:50px">
                  ${product.proName}
                  </h5>
                  <h5 class="m-0">$${product.proPrice}</h5>
                  <div>
                    <label>訂購數量：</label>
                    <select name="num" data-prod-idx="${idx}">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                    </select>
                    <div class="nav-item">
                      <a
                        class="nav-item nav-link"
                        data-proid="${product.proID}"
                        onclick="addCart(${idx})"
                      >
                        <i class="fa-solid fa-cart-plus"></i>加入購物車
                      </a>
                    </div>

                    <!-- <a href="about.html" class="dropdown-item">加入購物車</a> -->
                  </div>
                </div>
              </li>`;
                $("ul.item_list").prepend(productHtml);
                //   console.log(productHtml);
            });
        })
        .catch((error) => console.log("error", error));
};

function addCart(idx) {
    let cartValue = sessionStorage.getItem("cart");
    let cart =
        cartValue != null && cartValue != "" ? JSON.parse(cartValue) : [];

    let quantity = parseInt($(`select[data-prod-idx="${idx}"]`)[0].value);

    let oldCartItemIdx = cart.findIndex(
        (item) => item.proID == products[idx].proID
    );

    if (oldCartItemIdx != -1) {
        cart[oldCartItemIdx].quantity = quantity;
    } else {
        cart.push({
            ...products[idx],
            quantity: quantity,
        });
    }

    sessionStorage.setItem("cart", JSON.stringify(cart));

    $("#sussess-order").addClass("show");

    setTimeout(() => {
        $("#sussess-order").removeClass("show");
    }, 2000);
}
