var TradeViewModel = function () {
    var self = this;
    this.Items = ko.observableArray();
    this.Selected = ko.observableArray();
    this.CurrentItems = function () {

        AjaxNinja.Invoke(ODataApi.User + "('" + global.User.UserId() + "')/Items?$orderby=ModifiedDate desc&$expand=Owner,ItemImages,Category,ItemCommented,ItemUserFollowers", "GET", {}, function (data) {

            var result = [];
            $(data.value).each(function (index, value) {
                var res = $.extend(value, { CommentText: "", ImageClass: "metro-" + value.ItemImages.length });

                result.push(res);
            });
            self.Items(result);

            new Sortable(multi, {
                draggable: '.tile',
                handle: '.tile__name'
            });


            [].forEach.call(multi.getElementsByClassName('tile__list'), function (el) {
                new Sortable(el, { group: 'photo' });
            });

        });

    }

    this.SelectedItem = function () {
       
        AjaxNinja.Invoke(ODataApi.Item + "('" + $("#currentItem").data("text") + "')?$expand=Owner,ItemImages", "GET", {}, function (data) {

            self.Selected(data);

        });

    }


    this.SelectedUser = function (item) {

        window.location.href = '/Profile/Dashboard/' + item.FollowedUserId;

    }

    this.TradeItem = function (item) {

        
        var data = {

            BuyerId: global.User.UserId(),
            SellerId: self.Selected().OwnerId,
            ItemId:  $("#currentItem").data("text").toString() ,
            ModifiedDate: Helper.time()

        }

        AjaxNinja.Invoke(ODataApi.Trade, "POST", JSON.stringify(data), function (data) {

            alert(data.Id);

        });
    }
}

var items = new TradeViewModel();
ko.applyBindings(items, document.getElementById("tradeItemContainer"));
items.CurrentItems();
items.SelectedItem();
