import org.jetbrains.kotlin.gradle.dsl.KotlinJvmCompile

plugins {
    java
    kotlin(module = "jvm") version "1.3.21"
}

group = "com.developersam"
version = "0.0.1"

repositories {
    jcenter()
    mavenCentral()
}

dependencies {
    compile(kotlin(module = "stdlib-jdk8"))
    implementation(dependencyNotation = "com.developersam:game-ten:4.0.0")
    implementation(dependencyNotation = "com.google.code.gson:gson:2.8.5")
    implementation(dependencyNotation = "com.sparkjava:spark-core:2.8.0")
    implementation(dependencyNotation = "org.slf4j:slf4j-api:1.7.25")
    implementation(dependencyNotation = "org.slf4j:slf4j-simple:1.7.25")
}

tasks {
    named<Jar>("jar") {
        archiveName = "server.jar"
        manifest {
            attributes["Main-Class"] = "com.developersam.Main"
        }
        from({
            configurations["runtimeClasspath"].map { if (it.isDirectory) it else zipTree(it) }
        })
    }
}

configure<JavaPluginConvention> {
    sourceCompatibility = JavaVersion.VERSION_1_8
}

val compileKotlin: KotlinJvmCompile by tasks
compileKotlin.kotlinOptions {
    jvmTarget = "1.8"
}
val compileTestKotlin: KotlinJvmCompile by tasks
compileTestKotlin.kotlinOptions {
    jvmTarget = "1.8"
}
