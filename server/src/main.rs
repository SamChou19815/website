#[macro_use]
extern crate rocket;
use rocket::fs::FileServer;

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", FileServer::from("public/"))
}
