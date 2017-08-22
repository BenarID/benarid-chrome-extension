[@@@bs.config {no_export = no_export}]

open Jest

include Model

let _ =
  let open Expect in

  let dummy_rating = {
    id = 1;
    slug = "slug";
    label = "label";
    question = "question";
    sum = 0;
    count = 0;
    value = None;
  } in

  describe "Popup app" (fun () ->

      describe "set_rating_value" (fun () ->

          test "should update if id match" (fun () ->
              let rating = dummy_rating
              and rating_id = dummy_rating.id
              and value = 1 in

              let result = Popup_view.set_rating_value rating_id value rating in

              expect result |> toEqual { rating with
                                         value = Some value;
                                       }
            );

          test "should not update if id does not match" (fun () ->
              let rating = dummy_rating
              and rating_id = dummy_rating.id + 1
              and value = 1 in

              let result = Popup_view.set_rating_value rating_id value rating in

              expect result |> toEqual rating
            );

        );

      describe "merge_rating_with_value" (fun () ->

          test "should update sum and count if value = 1" (fun () ->
              let value = 1 in
              let rating = { dummy_rating with
                             value = Some value;
                           } in

              let result = Popup_view.merge_rating_with_value rating in

              expect result |> toEqual { rating with
                                         sum = rating.sum + value;
                                         count = rating.count + 1;
                                       }
            );

          test "should only update count if value = 0" (fun () ->
              let value = 0 in
              let rating = { dummy_rating with
                             value = Some value;
                           } in

              let result = Popup_view.merge_rating_with_value rating in

              expect result |> toEqual { rating with
                                         count = rating.count + 1;
                                       }
            );

        );

      describe "calculate_percentage" (fun () ->

          test "handles division by zero" (fun () ->
              let result = Popup_view.calculate_percentage 0 0 in

              expect result |> toBe 0.
            );

          test "correctly handles percentage" (fun () ->
              let result = Popup_view.calculate_percentage 1 4 in

              expect result |> toBeCloseTo 25.
            );

        );

      describe "get_color" (fun () ->

          test "should return red if under 50%" (fun () ->
              let result = Popup_view.get_color 30. in

              expect result |> toBe "red"
            );

          test "should return green if 50%" (fun () ->
              let result = Popup_view.get_color 50. in

              expect result |> toBe "green"
            );

          test "should return green if over 50%" (fun () ->
              let result = Popup_view.get_color 70. in

              expect result |> toBe "green"
            );

        );

    )

