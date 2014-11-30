package com.spatmole.rest;

/**
 * Created by konstantin on 22.11.14.
 */
public class AlbumRecord {

    Integer id;
    String description;
    String img_url;

    public AlbumRecord (Integer id, String description, String img_url){
        this.id = id;
        this.description = description;
        this.img_url = img_url;
    }
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUrl() {
        return img_url;
    }

    public Integer getId(){
        return id;
    }

    public void setUrl(String img_url) {
        this.img_url = img_url;
    }

    @Override
    public String toString() {
        return "Track [description=" + description + ", url=" + img_url + "]";
    }

}
