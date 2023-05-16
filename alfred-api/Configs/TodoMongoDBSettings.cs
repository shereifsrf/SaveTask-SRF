namespace alfred_api.Configs;

public class TodoMongoDBSettings
{
    public string ConnectionString { get; set; } = "";

    public string DatabaseName { get; set; } = "";
    public string TodoCollectionName { get; set; } = "";
    public string UserCollectionName { get; set; } = "";
    public string SessionCollectionName { get; set; } = "";
}