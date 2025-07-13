cmake_minimum_required(VERSION 3.16)
include($ENV{IDF_PATH}/tools/cmake/project.cmake)
set(PROJECT_NAME "esp32_project")
project(${PROJECT_NAME})

# Set components directory with proper path handling
file(TO_CMAKE_PATH "C:/2/esp-idf/components" IDF_COMPONENTS)
file(TO_CMAKE_PATH "${CMAKE_CURRENT_LIST_DIR}/components" PROJECT_COMPONENTS)

set(EXTRA_COMPONENT_DIRS 
    ${PROJECT_COMPONENTS}
    ${IDF_COMPONENTS}/bt
    ${IDF_COMPONENTS}/nvs_flash
)

# Global compiler flags
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wno-error")
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Wno-error")
set(EXTRA_COMPONENT_DIRS
    ${CMAKE_CURRENT_SOURCE_DIR}/components
    # Remove explicit IDF component paths - they're automatically included
set(EXTRA_COMPONENT_DIRS $ENV{IDF_PATH}/components/arduino/libraries/PubSubClient)
)
set(EXTRA_COMPONENT_DIRS 
    "$ENV{IDF_PATH}/components/bt/host/nimble"
)
