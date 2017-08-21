[@@@bs.config {no_export = no_export}]

open Jest

include Model

let _ =

  describe "Conversion from JSON to JS object" (fun () ->
      let open Expect in

      test "user_obj_of_json" (fun () ->
          let json = Js.Json.object_ @@ Js.Dict.fromArray [|
              ("id", Js.Json.number 1.);
              ("name", Js.Json.string "name");
            |] in

          let obj = Model.user_obj_of_json json in

          expect obj |> toEqual [%bs.obj { id = 1; name = "name" }]
        );

      test "error_message_of_json" (fun () ->
          let json = Js.Json.object_ @@ Js.Dict.fromArray [|
              ("message", Js.Json.string "foo")
            |] in

          let message = Model.error_message_of_json json in

          expect message |> toBe "foo"
        );

      test "rating_obj_of_json" (fun () ->
          let json = Js.Json.object_ @@ Js.Dict.fromArray [|
              ("id", Js.Json.number 1.);
              ("label", Js.Json.string "label");
              ("slug", Js.Json.string "slug");
              ("question", Js.Json.string "question");
              ("sum", Js.Json.number 2.);
              ("count", Js.Json.number 3.);
            |] in

          let obj = Model.rating_obj_of_json json in

          expect obj |> toEqual [%bs.obj {
            id = 1;
            label = "label";
            slug = "slug";
            question = "question";
            sum = 2;
            count = 3;
          }]
        );

      test "rating_data_obj_from_json without rated" (fun () ->
          let json = Js.Json.object_ @@ Js.Dict.fromArray [|
              ("id", Js.Json.number 1.);
              ("rating", Js.Json.array [| |]);
            |] in

          let obj = Model.rating_data_obj_of_json json in

          expect obj |> toEqual [%bs.obj {
            id = 1;
            ratings = [| |];
            rated = None;
          }]
        );

      test "rating_data_obj_from_json with rated" (fun () ->
          let json = Js.Json.object_ @@ Js.Dict.fromArray [|
              ("id", Js.Json.number 1.);
              ("rating", Js.Json.array [| |]);
              ("rated", Js.Json.boolean Js.true_)
            |] in

          let obj = Model.rating_data_obj_of_json json in

          expect obj |> toEqual [%bs.obj {
            id = 1;
            ratings = [| |];
            rated = Some true;
          }]
        );

    );

  describe "Conversion from JS Object to OCaml record" (fun () ->
      let open Expect in

      test "user_of_user_obj" (fun () ->
          let obj = [%bs.obj { id = 1; name = "name" }] in

          let user = Model.user_of_user_obj obj in

          expect user |> toEqual { id = 1; name = "name" }
        );

      test "rating_of_rating_obj" (fun () ->
          let obj = [%bs.obj {
            id = 1;
            label = "label";
            slug = "slug";
            question = "question";
            sum = 2;
            count = 3;
          }] in

          let rating = Model.rating_of_rating_obj obj in

          expect rating |> toEqual {
            id = 1;
            label = "label";
            slug = "slug";
            question = "question";
            sum = 2;
            count = 3;
            value = None;
          }
        );

      test "rating_data_of_rating_data_obj" (fun () ->
          let obj = [%bs.obj {
            id = 1;
            ratings = [| |];
            rated = None;
          }] in

          let rating_data = Model.rating_data_of_rating_data_obj obj in

          expect rating_data |> toEqual {
            id = 1;
            ratings = [| |];
            rated = None;
          }

        );
    )
